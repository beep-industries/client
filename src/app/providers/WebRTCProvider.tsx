import React, {
  createContext,
  type RefObject,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react"
import { useRealTimeSocket } from "@/app/providers/RealTimeSocketProvider"
import { Presence } from "phoenix"

export interface PresenceDesc {
  id: number
  user_id: string
  video: boolean
  audio: boolean
  presence_only?: boolean
}

export interface RemoteState {
  id: number
  userId: string
  tracks: { audio: MediaStream | null; video: MediaStream | null }
  audio: boolean
  video: boolean
}

export interface WebRTCState {
  // UI/status
  server: string | null
  session: string | null
  iceStatus: RTCIceConnectionState
  channelStatus: string
  joined: boolean
  videoStreamRef: RefObject<MediaStream | null> | null
  camEnabled: boolean
  micEnabled: boolean
  screenShareEnabled: boolean
  // Media
  remoteTracks: RemoteState[]
  // Actions
  join: (server: string, session: string) => Promise<void>
  leave: () => Promise<void>
  startCam: () => Promise<void>
  startScreenShare: () => Promise<void>
  stopScreenShare: () => Promise<void>
  stopCam: () => void
  startMic: () => Promise<void>
  stopMic: () => void
}

const WebRTCContext = createContext<WebRTCState | undefined>(undefined)

export function WebRTCProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<string | null>(null)
  const [server, setServer] = useState<string | null>(null)
  const [iceStatus, setIceStatus] = useState<RTCIceConnectionState>("new")
  const [channelStatus, setChannelStatus] = useState<string>("Click Join Button...")
  const [joined, setJoined] = useState(false)
  const [camEnabled, setCamEnabled] = useState(false)
  const [screenShareEnabled, setScreenShareEnabled] = useState(false)
  const [micEnabled, setMicEnabled] = useState(false)
  const [remoteTracks, setRemoteTracks] = useState<RemoteState[]>([])

  const rtcRef = useRef<RTCPeerConnection | null>(null)
  const presenceRef = useRef<Presence | null>(null)
  const dataChannelRef = useRef<RTCDataChannel | null>(null)
  const camStreamRef = useRef<MediaStream | null>(null)
  const videoStreamRef = useRef<MediaStream | null>(null)
  const camTransceiverRef = useRef<RTCRtpTransceiver | null>(null)
  const screenShareStreamRef = useRef<MediaStream | null>(null)
  const screenShareTransceiverVideoRef = useRef<RTCRtpTransceiver | null>(null)
  const screenShareTransceiverAudioRef = useRef<RTCRtpTransceiver | null>(null)
  const micStreamRef = useRef<MediaStream | null>(null)
  const micTransceiverRef = useRef<RTCRtpTransceiver | null>(null)
  const negotiateCallbackRef = useRef<((json: string) => void) | null>(null)
  const rtcConfig = useRef<RTCConfiguration>({})

  // Phoenix Channel for signaling (initial offer/leave). DataChannel remains for in-call negotiation.
  const { join: joinTopic, leave: leaveTopic, lockChannel, unlockChannel } = useRealTimeSocket()
  const channelTopicRef = useRef<string | null>(null)

  const leave = useCallback(async () => {
    await camTransceiverRef.current?.sender.replaceTrack(null)
    camTransceiverRef.current = null
    camStreamRef.current?.getTracks().forEach((t) => t.stop())
    camStreamRef.current = null
    await screenShareTransceiverVideoRef.current?.sender.replaceTrack(null)
    screenShareTransceiverVideoRef.current = null
    await screenShareTransceiverAudioRef.current?.sender.replaceTrack(null)
    screenShareTransceiverAudioRef.current = null
    screenShareStreamRef.current?.getTracks().forEach((t) => t.stop())
    screenShareStreamRef.current = null
    await micTransceiverRef.current?.sender.replaceTrack(null)
    micTransceiverRef.current = null
    micStreamRef.current?.getTracks().forEach((t) => t.stop())
    micStreamRef.current = null
    // Close rtc
    rtcRef.current?.close()
    rtcRef.current = null
    // Notify backend via Phoenix channel and leave topic
    if (session != null && channelTopicRef.current) {
      const topic = channelTopicRef.current
      unlockChannel(topic, "webrtc")
      const ch = joinTopic(topic)
      try {
        await new Promise<void>((resolve) => {
          ch?.push("leave", {
            session_id: String(session),
          })
            .receive("ok", () => resolve())
            .receive("error", () => resolve()) // resolve anyway
        })
      } finally {
        leaveTopic(topic)
        channelTopicRef.current = null
      }
    }
    setSession(null)
    setRemoteTracks([])
    setIceStatus("disconnected")
    setChannelStatus("Click Join Button...")
    setJoined(false)
    setCamEnabled(false)
    setMicEnabled(false)
  }, [joinTopic, leaveTopic, session])

  const ensureRtc = useCallback(() => {
    if (!rtcRef.current) {
      const rtc = new RTCPeerConnection(rtcConfig.current)

      // ICE state
      rtc.oniceconnectionstatechange = () => {
        const state = rtc.iceConnectionState
        setIceStatus(state)
        if (state === "disconnected" || state === "failed") {
          // stop local tracks
          leave()
        }
      }
      // Remote tracks management
      rtc.ontrack = (e) => {
        const track = e.track
        const id = e.transceiver.mid!.split("-")[0]

        setRemoteTracks((prev) => {
          return prev.map((t) => {
            if (t.id === parseInt(id)) {
              if (track.kind === "video") {
                t.tracks.video = new MediaStream([track])
              } else {
                t.tracks.audio = new MediaStream([track])
              }
            }
            return t
          })
        })
        track.addEventListener("mute", () => {})
        track.addEventListener("ended", () => {})
      }
      rtcRef.current = rtc
    }
    return rtcRef.current!
  }, [])

  const negotiate = useCallback(async () => {
    const rtc = ensureRtc()
    const dc = dataChannelRef.current
    if (!dc) throw new Error("Data channel not open")
    const offer = await rtc.createOffer()
    await rtc.setLocalDescription(offer)
    dc.send(JSON.stringify(offer))
    const json = await new Promise<string>((resolve) => {
      negotiateCallbackRef.current = resolve
    })
    const answer = JSON.parse(json)
    try {
      await rtc.setRemoteDescription(answer)
    } catch (err) {
      console.error("rtc.setRemoteDescription(answer) error", err)
    }
  }, [ensureRtc])

  const handleOffer = useCallback(
    async (json: string) => {
      const rtc = ensureRtc()
      const offer = JSON.parse(json)
      try {
        await rtc.setRemoteDescription(offer)
      } catch (err) {
        console.error("rtc.setRemoteDescription(offer) error", err)
      }
      const answer = await rtc.createAnswer()
      await rtc.setLocalDescription(answer)
      dataChannelRef.current?.send(JSON.stringify(answer))
    },
    [ensureRtc]
  )

  const join = useCallback(
    async (server: string, sess: string) => {
      if (server === server && session === sess && iceStatus === "connected") return
      if (joined) await leave()
      setJoined(true)
      setSession(sess)
      setServer(server)

      // Join Phoenix channel topic and perform initial offer/answer via channel
      const topic = `voice-channel:${sess}`
      lockChannel(topic, "webrtc")
      channelTopicRef.current = topic

      // Wait for channel join callback to complete before setting up RTC
      const channel = await new Promise<ReturnType<typeof joinTopic>>((resolve) => {
        const ch = joinTopic(
          topic,
          undefined,
          (response) => {
            const parsed = response as { rtc_configuration: RTCConfiguration }
            rtcConfig.current = parsed.rtc_configuration
            resolve(ch)
          },
          true
        )
      })

      presenceRef.current = new Presence(channel)

      presenceRef.current.onSync(() => {
        const tracks: PresenceDesc[] = []
        presenceRef.current?.list().forEach((user: { metas: PresenceDesc[] }) => {
          if (!user.metas[0].presence_only) {
            tracks.push({ ...user.metas[0] })
          }
        })

        setRemoteTracks((prev) => {
          return tracks.map((user) => {
            const updated = prev.find((value) => value.userId === user.user_id)
            if (updated) {
              return { ...updated, video: user.video, audio: user.audio }
            }
            return {
              ...user,
              tracks: { audio: null, video: null },
              userId: user.user_id,
            }
          })
        })
      })

      const rtc = ensureRtc()
      setChannelStatus(`Joining session ${sess} as endpoint`)

      const dataChannel = rtc.createDataChannel("offer/answer")
      dataChannel.onmessage = (event) => {
        const json = JSON.parse(event.data)
        if (json.type === "offer") {
          void handleOffer(event.data)
        } else if (json.type === "answer") {
          negotiateCallbackRef.current?.(event.data)
          negotiateCallbackRef.current = null
        }
      }
      dataChannel.onopen = () => {
        setChannelStatus(`Joined session ${sess}`)
        setCamEnabled(false)
        setMicEnabled(false)
      }
      dataChannelRef.current = dataChannel

      const offer = await rtc.createOffer()
      await rtc.setLocalDescription(offer)

      await new Promise<void>((resolve, reject) => {
        channel
          .push("offer", {
            session_id: String(sess),
            offer_sdp: offer.sdp,
          })
          .receive("ok", async (resp: { answer_sdp: string }) => {
            try {
              await rtc.setRemoteDescription(JSON.parse(resp.answer_sdp))
              setIceStatus(rtc.iceConnectionState)
              resolve()
            } catch (e) {
              reject(e)
            }
          })
          .receive("error", (err: unknown) => {
            console.error("join error", err)
            setIceStatus("failed")
            reject(err)
          })
      })
    },
    [ensureRtc, handleOffer, joinTopic, session, iceStatus]
  )

  const stopScreenShare = useCallback(async () => {
    setScreenShareEnabled(false)
    if (joined && camTransceiverRef.current && screenShareTransceiverAudioRef.current) {
      await camTransceiverRef.current?.sender.replaceTrack(null)
      await screenShareTransceiverAudioRef.current?.sender.replaceTrack(null)
      screenShareStreamRef.current?.getTracks().forEach((t) => t.stop())
      screenShareStreamRef.current = null
      videoStreamRef.current?.getTracks().forEach((t) => t.stop())
      videoStreamRef.current = null
      joinTopic(channelTopicRef.current!).push("state_change", {
        video: false,
        audio: micEnabled,
      })
    }
  }, [joinTopic, joined, micEnabled])

  const startCam = useCallback(async () => {
    setCamEnabled(true)
    await stopScreenShare()
    if (joined) {
      camStreamRef.current = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 360 },
      })
      videoStreamRef.current = camStreamRef.current
      if (camTransceiverRef.current) {
        camTransceiverRef.current?.sender.replaceTrack(camStreamRef.current.getTracks()[0])
      } else {
        const rtc = ensureRtc()
        camTransceiverRef.current = rtc.addTransceiver(camStreamRef.current.getTracks()[0], {
          direction: "sendonly",
          streams: [camStreamRef.current],
        })
        await negotiate()
      }
      joinTopic(channelTopicRef.current!).push("state_change", {
        video: true,
        audio: micEnabled,
      })
    }
  }, [ensureRtc, joinTopic, joined, micEnabled, negotiate, stopScreenShare])

  const stopCam = useCallback(async () => {
    setCamEnabled(false)
    if (joined && camTransceiverRef.current) {
      await camTransceiverRef.current?.sender.replaceTrack(null)
      camStreamRef.current?.getTracks().forEach((t) => t.stop())
      camStreamRef.current = null
      joinTopic(channelTopicRef.current!).push("state_change", {
        video: false,
        audio: micEnabled,
      })
    }
  }, [joinTopic, joined, micEnabled])

  const startScreenShare = useCallback(async () => {
    setScreenShareEnabled(true)
    await stopCam()
    if (joined) {
      screenShareStreamRef.current = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      })
      videoStreamRef.current = screenShareStreamRef.current
      const rtc = ensureRtc()
      let needNegotiate = false
      for (const track of videoStreamRef.current.getTracks()) {
        if (track.kind === "video") {
          if (camTransceiverRef.current) {
            camTransceiverRef.current?.sender.replaceTrack(track)
          } else {
            const rtc = ensureRtc()
            camTransceiverRef.current = rtc.addTransceiver(track, {
              direction: "sendonly",
            })
            needNegotiate = true
          }
        } else {
          if (screenShareTransceiverAudioRef.current) {
            await screenShareTransceiverAudioRef.current.sender.replaceTrack(track)
          } else {
            screenShareTransceiverAudioRef.current = rtc.addTransceiver(track, {
              direction: "sendonly",
            })
            needNegotiate = true
          }
        }
      }
      if (needNegotiate) await negotiate()
      joinTopic(channelTopicRef.current!).push("state_change", {
        video: true,
        audio: true,
      })
    }
  }, [ensureRtc, joinTopic, joined, negotiate, stopCam])

  const startMic = useCallback(async () => {
    setMicEnabled(true)
    if (joined) {
      const rtc = ensureRtc()
      micStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true })
      micTransceiverRef.current = rtc.addTransceiver(micStreamRef.current.getTracks()[0], {
        direction: "sendonly",
        streams: [micStreamRef.current],
      })
      await negotiate()
      joinTopic(channelTopicRef.current!).push("state_change", {
        video: camEnabled,
        audio: true,
      })
    }
  }, [camEnabled, ensureRtc, joinTopic, negotiate, joined])

  const stopMic = useCallback(async () => {
    setMicEnabled(false)
    if (joined) {
      await micTransceiverRef.current!.sender.replaceTrack(null)
      micStreamRef.current?.getTracks().forEach((t) => t.stop())
      micStreamRef.current = null
      joinTopic(channelTopicRef.current!).push("state_change", {
        video: camEnabled,
        audio: false,
      })
    }
  }, [camEnabled, joinTopic, joined])

  const value = useMemo<WebRTCState>(
    () => ({
      server,
      session,
      iceStatus,
      channelStatus,
      joined,
      videoStreamRef,
      screenShareEnabled,
      camEnabled,
      micEnabled,
      remoteTracks,
      join,
      leave,
      startCam,
      startScreenShare,
      stopCam,
      stopScreenShare,
      startMic,
      stopMic,
    }),
    [
      server,
      session,
      iceStatus,
      channelStatus,
      joined,
      videoStreamRef,
      camEnabled,
      screenShareEnabled,
      micEnabled,
      remoteTracks,
      join,
      leave,
      startCam,
      startScreenShare,
      stopCam,
      stopScreenShare,
      startMic,
      stopMic,
    ]
  )

  return <WebRTCContext.Provider value={value}>{children}</WebRTCContext.Provider>
}

export function useWebRTC() {
  const ctx = useContext(WebRTCContext)
  if (!ctx) throw new Error("useWebRTC must be used within a WebRTCProvider")
  return ctx
}
