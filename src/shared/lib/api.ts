import ky from "ky"

export const api = ky.create({
  prefixUrl: import.meta.env.VITE_BACKEND_URL,
  timeout: 30000,
  credentials: "include",
})

export const communities_api = ky.create({
  prefixUrl: import.meta.env.VITE_COMMUNITIES_URL,
  timeout: 30000,
  credentials: "include",
})
