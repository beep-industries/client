import ky from "ky"

export const api = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL || "/api",
  timeout: 30000,
  hooks: {
    beforeRequest: [
      (request) => {
        const token = localStorage.getItem("auth_token")
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`)
        }
      },
    ],
  },
})
