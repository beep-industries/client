import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react"
import { useRealTimeSocket } from "@/app/providers/RealTimeSocketProvider"
import { Presence } from "phoenix"

export interface PresenceDesc {
  id: number
  username: string
  video: boolean
  audio: boolean
}

export interface RemoteState {
  id: number
  username: string
  tracks: { audio: MediaStream | null; video: MediaStream | null }
  audio: boolean
  video: boolean
}

export interface WebRTCState {
  // UI/status
  session: number | null
  iceStatus: RTCIceConnectionState
  channelStatus: string
  joined: boolean
  camEnabled: boolean
  micEnabled: boolean
  // Media
  remoteTracks: RemoteState[]
  // Actions
  join: (session: number, username: string) => Promise<void>
  leave: () => Promise<void>
  startCam: () => Promise<void>
  stopCam: () => void
  startMic: () => Promise<void>
  stopMic: () => void
}

const WebRTCContext = createContext<WebRTCState | undefined>(undefined)

export function WebRTCProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<number | null>(null)
  const [iceStatus, setIceStatus] = useState<RTCIceConnectionState>("new")
  const [channelStatus, setChannelStatus] = useState<string>("Click Join Button...")
  const [joined, setJoined] = useState(false)
  const [camEnabled, setCamEnabled] = useState(false)
  const [micEnabled, setMicEnabled] = useState(false)
  const [remoteTracks, setRemoteTracks] = useState<RemoteState[]>([])

  const rtcRef = useRef<RTCPeerConnection | null>(null)
  const presenceRef = useRef<Presence | null>(null)
  const dataChannelRef = useRef<RTCDataChannel | null>(null)
  const camStreamRef = useRef<MediaStream | null>(null)
  const camTransceiverRef = useRef<RTCRtpTransceiver | null>(null)
  const micStreamRef = useRef<MediaStream | null>(null)
  const micTransceiverRef = useRef<RTCRtpTransceiver | null>(null)
  const negotiateCallbackRef = useRef<((json: string) => void) | null>(null)

  // Phoenix Channel for signaling (initial offer/leave). DataChannel remains for in-call negotiation.
  const { join: joinTopic, leave: leaveTopic } = useRealTimeSocket()
  const channelTopicRef = useRef<string | null>(null)

  const ensureRtc = useCallback(() => {
    if (!rtcRef.current) {
      const rtc = new RTCPeerConnection()
      // ICE state
      rtc.oniceconnectionstatechange = () => {
        const state = rtc.iceConnectionState
        setIceStatus(state)
        if (state === "disconnected" || state === "failed") {
          // stop local tracks
          camStreamRef.current?.getTracks().forEach((t) => t.stop())
          micStreamRef.current?.getTracks().forEach((t) => t.stop())
          rtc.close()
          rtcRef.current = null
          setJoined(false)
          setCamEnabled(false)
          setMicEnabled(false)
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
      console.log("rtc.setRemoteDescription(answer) error", err)
    }
  }, [ensureRtc])

  const handleOffer = useCallback(
    async (json: string) => {
      const rtc = ensureRtc()
      const offer = JSON.parse(json)
      try {
        await rtc.setRemoteDescription(offer)
      } catch (err) {
        console.log("rtc.setRemoteDescription(offer) error", err)
      }
      const answer = await rtc.createAnswer()
      await rtc.setLocalDescription(answer)
      dataChannelRef.current?.send(JSON.stringify(answer))
    },
    [ensureRtc]
  )

  const join = useCallback(
    async (sess: number, username: string) => {
      setSession(sess)
      const rtc = ensureRtc()
      setChannelStatus(`Joining session ${sess} as endpoint`)
      setJoined(true)

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
        setCamEnabled(true)
        setMicEnabled(true)
      }
      dataChannelRef.current = dataChannel

      // Join Phoenix channel topic and perform initial offer/answer via channel
      const topic = `voice-channel:${sess}`
      channelTopicRef.current = topic
      const channel = joinTopic(topic, { username: username })
      presenceRef.current = new Presence(channel)

      presenceRef.current.onSync(() => {
        const tracks: PresenceDesc[] = []
        presenceRef.current?.list().forEach((user: { metas: PresenceDesc[] }) => {
          tracks.push({ ...user.metas[0] })
        })

        setRemoteTracks((prev) => {
          return tracks.map((user) => {
            const updated = prev.find((value) => value.username === user.username)
            if (updated) {
              return { ...updated, video: user.video, audio: user.audio }
            }
            return {
              ...user,
              tracks: { audio: null, video: null },
            }
          })
        })
      })

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
            reject(err)
          })
      })
    },
    [ensureRtc, handleOffer, joinTopic]
  )

  const leave = useCallback(async () => {
    const sess = session
    setIceStatus("new")
    setChannelStatus("Click Join Button...")
    setJoined(false)
    setCamEnabled(false)
    setMicEnabled(false)
    await camTransceiverRef.current?.sender.replaceTrack(null)
    camTransceiverRef.current = null
    camStreamRef.current?.getTracks().forEach((t) => t.stop())
    camStreamRef.current = null
    await micTransceiverRef.current?.sender.replaceTrack(null)
    micTransceiverRef.current = null
    micStreamRef.current?.getTracks().forEach((t) => t.stop())
    micStreamRef.current = null
    // Close rtc
    rtcRef.current?.close()
    rtcRef.current = null
    setRemoteTracks([])
    // Notify backend via Phoenix channel and leave topic
    if (sess != null && channelTopicRef.current) {
      const topic = channelTopicRef.current
      const ch = joinTopic(topic)
      try {
        await new Promise<void>((resolve) => {
          ch?.push("leave", {
            session_id: String(sess),
          })
            .receive("ok", () => resolve())
            .receive("error", () => resolve()) // resolve anyway
        })
      } finally {
        leaveTopic(topic)
        channelTopicRef.current = null
      }
    }
  }, [joinTopic, leaveTopic, session])

  const startCam = useCallback(async () => {
    setCamEnabled(false)
    camStreamRef.current = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 360 },
    })
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
      audio: !micEnabled,
    })
  }, [ensureRtc, joinTopic, micEnabled, negotiate])

  const stopCam = useCallback(async () => {
    await camTransceiverRef.current!.sender.replaceTrack(null)
    camStreamRef.current?.getTracks().forEach((t) => t.stop())
    camStreamRef.current = null
    setCamEnabled(true)
    joinTopic(channelTopicRef.current!).push("state_change", {
      video: false,
      audio: !micEnabled,
    })
  }, [joinTopic, micEnabled])

  const startMic = useCallback(async () => {
    setMicEnabled(false)
    const rtc = ensureRtc()
    micStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true })
    micTransceiverRef.current = rtc.addTransceiver(micStreamRef.current.getTracks()[0], {
      direction: "sendonly",
      streams: [micStreamRef.current],
    })
    await negotiate()
    joinTopic(channelTopicRef.current!).push("state_change", {
      video: !camEnabled,
      audio: true,
    })
  }, [camEnabled, ensureRtc, joinTopic, negotiate])

  const stopMic = useCallback(async () => {
    await micTransceiverRef.current!.sender.replaceTrack(null)
    micStreamRef.current?.getTracks().forEach((t) => t.stop())
    micStreamRef.current = null
    setMicEnabled(true)
    joinTopic(channelTopicRef.current!).push("state_change", {
      video: !camEnabled,
      audio: false,
    })
  }, [camEnabled, joinTopic])

  const value = useMemo<WebRTCState>(
    () => ({
      session,
      iceStatus,
      channelStatus,
      joined,
      camEnabled,
      micEnabled,
      remoteTracks,
      join,
      leave,
      startCam,
      stopCam,
      startMic,
      stopMic,
    }),
    [
      session,
      iceStatus,
      channelStatus,
      joined,
      camEnabled,
      micEnabled,
      remoteTracks,
      join,
      leave,
      startCam,
      stopCam,
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
