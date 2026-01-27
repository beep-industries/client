import { useMutation } from "@tanstack/react-query"
import { uploadFile } from "./content.api"

interface UploadFileRequest {
  signedURL: string
  file: File
}

export const useUploadFile = () => {
  return useMutation({
    mutationKey: ["uploadFile"],
    mutationFn: ({ signedURL, file }: UploadFileRequest) => {
      return uploadFile(signedURL, file)
    },
  })
}
