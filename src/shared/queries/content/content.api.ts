import ky from "ky"

const createContentApi = () =>
  ky.create({
    prefixUrl: import.meta.env.VITE_CONTENT_SERVICE_URL,
    timeout: 30000,
  })

export const uploadFile = (signedURL: string, file: File, contentType: string) => {
  const url = new URL(signedURL)
  const endpoint = url.pathname + url.search
  const api = createContentApi()

  return api.put(endpoint, {
    body: file,
    headers: {
      "Content-Type": contentType,
    },
  })
}
