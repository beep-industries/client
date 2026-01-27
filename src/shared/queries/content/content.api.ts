import ky from "ky"

const createContentApi = () =>
  ky.create({
    prefixUrl: import.meta.env.VITE_CONTENT_SERVICE_URL,
    timeout: 30000,
  })

export const uploadFile = async (signedURL: string, file: File) => {
  const url = new URL(signedURL)
  const pathname = url.pathname.substring(1)
  const endpoint = pathname + url.search
  const api = createContentApi()
  const content = await file.arrayBuffer()

  const response = await api
    .put(endpoint, {
      body: content,
      headers: {
        "content-type": file.type,
      },
    })
    .text()
  return response
}
