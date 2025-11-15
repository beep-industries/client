import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react"
import { useRealTimeSocket } from "@/app/providers/RealTimeSocketProvider"

export interface WebRTCState {
  // UI/status
  session: number | null
  endpointId: number
  iceStatus: RTCIceConnectionState
  channelStatus: string
  joined: boolean
  camEnabled: boolean
  micEnabled: boolean
  // Media
  remoteTracks: MediaStreamTrack[]
  // Actions
  join: (session: number) => Promise<void>
  leave: () => Promise<void>
  startCam: () => Promise<void>
  startMic: () => Promise<void>
}

const WebRTCContext = createContext<WebRTCState | undefined>(undefined)

export function WebRTCProvider({ children }: { children: React.ReactNode }) {
  const endpointIdRef = useRef<number>(Math.floor(Math.random() * 1000000000))
  const [session, setSession] = useState<number | null>(null)
  const [iceStatus, setIceStatus] = useState<RTCIceConnectionState>("new")
  const [channelStatus, setChannelStatus] = useState<string>("Click Join Button...")
  const [joined, setJoined] = useState(false)
  const [camEnabled, setCamEnabled] = useState(false)
  const [micEnabled, setMicEnabled] = useState(false)
  const [remoteTracks, setRemoteTracks] = useState<MediaStreamTrack[]>([])

  const rtcRef = useRef<RTCPeerConnection | null>(null)
  const dataChannelRef = useRef<RTCDataChannel | null>(null)
  const camStreamRef = useRef<MediaStream | null>(null)
  const micStreamRef = useRef<MediaStream | null>(null)
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
        setRemoteTracks((prev) => {
          if (prev.find((t) => t.id === track.id)) return prev
          return [...prev, track]
        })
        track.addEventListener("mute", () => {
          setRemoteTracks((prev) => prev.filter((t) => t.id !== track.id))
        })
        track.addEventListener("ended", () => {
          setRemoteTracks((prev) => prev.filter((t) => t.id !== track.id))
        })
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
    await dc.send(JSON.stringify(offer))
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
      await dataChannelRef.current?.send(JSON.stringify(answer))
    },
    [ensureRtc]
  )

  const join = useCallback(
    async (sess: number) => {
      setSession(sess)
      const rtc = ensureRtc()
      setChannelStatus(`Joining session ${sess} as endpoint ${endpointIdRef.current}`)
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
        setChannelStatus(`Joined session ${sess} as endpoint ${endpointIdRef.current}`)
        setCamEnabled(true)
        setMicEnabled(true)
      }
      dataChannelRef.current = dataChannel

      // Join Phoenix channel topic and perform initial offer/answer via channel
      const topic = `voice-channel:${sess}`
      channelTopicRef.current = topic
      const channel = joinTopic(topic)

      const offer = await rtc.createOffer()
      await rtc.setLocalDescription(offer)

      await new Promise<void>((resolve, reject) => {
        channel
          .push("offer", {
            session_id: String(sess),
            endpoint_id: String(endpointIdRef.current),
            offer_sdp: offer.sdp,
          })
          .receive("ok", async (resp: { answer_sdp: string }) => {
            try {
              console.log("join ok", resp)
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
            endpoint_id: String(endpointIdRef.current),
          })
            .receive("ok", () => resolve())
            .receive("error", () => resolve()) // resolve anyway
        })
      } finally {
        leaveTopic(topic)
        channelTopicRef.current = null
      }
    }
    endpointIdRef.current = Math.floor(Math.random() * 1000000000)
  }, [joinTopic, leaveTopic, session])

  const startCam = useCallback(async () => {
    setCamEnabled(false)
    const rtc = ensureRtc()
    const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 360 } })
    camStreamRef.current = stream
    rtc.addTransceiver(stream.getTracks()[0], {
      direction: "sendonly",
      streams: [stream],
    })
    await negotiate()
  }, [ensureRtc, negotiate])

  const startMic = useCallback(async () => {
    setMicEnabled(false)
    const rtc = ensureRtc()
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    micStreamRef.current = stream
    rtc.addTransceiver(stream.getTracks()[0], {
      direction: "sendonly",
      streams: [stream],
    })
    await negotiate()
  }, [ensureRtc, negotiate])

  const value = useMemo<WebRTCState>(
    () => ({
      session,
      endpointId: endpointIdRef.current,
      iceStatus,
      channelStatus,
      joined,
      camEnabled,
      micEnabled,
      remoteTracks,
      join,
      leave,
      startCam,
      startMic,
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
      startMic,
    ]
  )

  return <WebRTCContext.Provider value={value}>{children}</WebRTCContext.Provider>
}

export function useWebRTC() {
  const ctx = useContext(WebRTCContext)
  if (!ctx) throw new Error("useWebRTC must be used within a WebRTCProvider")
  return ctx
}
