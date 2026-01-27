import { useMutation } from "@tanstack/react-query"
import { uploadFile } from "./content.api"

interface UploadFileRequest {
  signedURL: string
  file: File
  contentType: string
}

export const useUploadFile = () => {
  return useMutation({
    mutationKey: ["uploadFile"],
    mutationFn: ({ signedURL, file, contentType }: UploadFileRequest) => {
      return uploadFile(signedURL, file, contentType)
    },
  })
}
