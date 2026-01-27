import { createContext, useContext, useRef, useState } from "react"
import { Avatar, AvatarImage } from "./ui/Avatar"
import { Controller, useForm, type Control, type UseFormHandleSubmit } from "react-hook-form"
import { Plus } from "lucide-react"

interface CompressionOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  mimeType?: "image/jpeg" | "image/png" | "image/webp"
}

function isGif(file: File): boolean {
  return file.type === "image/gif"
}

async function compressImage(file: File, options: CompressionOptions = {}): Promise<Blob> {
  // Preserve GIFs as-is to keep animation
  if (isGif(file)) {
    return file
  }

  const { maxWidth = 800, maxHeight = 800, quality = 0.8, mimeType = "image/jpeg" } = options

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(img.src)

      const { width, height } = img

      // Crop to square from center
      const size = Math.min(width, height)
      const cropX = (width - size) / 2
      const cropY = (height - size) / 2

      // Calculate output size
      const outputSize = Math.min(size, maxWidth, maxHeight)

      const canvas = document.createElement("canvas")
      canvas.width = outputSize
      canvas.height = outputSize

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Failed to get canvas context"))
        return
      }

      // Draw cropped square region onto canvas
      ctx.drawImage(img, cropX, cropY, size, size, 0, 0, outputSize, outputSize)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error("Failed to compress image"))
          }
        },
        mimeType,
        quality
      )
    }

    img.onerror = () => reject(new Error("Failed to load image"))
    img.src = URL.createObjectURL(file)
  })
}

interface PictureFormProps {
  children: React.ReactNode
  className?: string
  compressionOptions?: CompressionOptions
}

interface PicturePreviewProps {
  boxClassName?: string
  className?: string
}

interface FormValues {
  picture: FileList
}

interface PictureFormContextProps {
  control: Control<FormValues, unknown, FormValues>
  handleSubmit: UseFormHandleSubmit<FormValues, FormValues>
  compressedImage: Blob | null
  setCompressedImage: (blob: Blob | null) => void
  compressionOptions?: CompressionOptions
}

const PictureFormContext = createContext<PictureFormContextProps>({} as PictureFormContextProps)

export function usePictureForm() {
  const context = useContext(PictureFormContext)
  if (!context) {
    throw new Error("usePictureForm must be used within a PictureForm")
  }
  return context
}

export function PictureForm({ children, className, compressionOptions }: PictureFormProps) {
  const { control, handleSubmit } = useForm<FormValues>()
  const [compressedImage, setCompressedImage] = useState<Blob | null>(null)

  return (
    <PictureFormContext.Provider
      value={{
        control,
        handleSubmit,
        compressedImage,
        setCompressedImage,
        compressionOptions,
      }}
    >
      <form className={className}>{children}</form>
    </PictureFormContext.Provider>
  )
}

export function PicturePreview({ className, boxClassName }: PicturePreviewProps) {
  const [preview, setPreview] = useState<string>()
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { control, setCompressedImage, compressionOptions } = useContext(PictureFormContext)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return

    try {
      const compressed = await compressImage(file, compressionOptions)
      setCompressedImage(compressed)
      setPreview(URL.createObjectURL(compressed))
    } catch (error) {
      console.error("Failed to compress image:", error)
      setCompressedImage(null)
      setPreview(undefined)
    }
  }

  const handleFileChange = async (files: FileList | null, onChange: (files: FileList) => void) => {
    if (!files || files.length === 0) return

    onChange(files)
    await processFile(files[0])
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      await processFile(files[0])
    }
  }

  return (
    <div className={className}>
      <Controller
        name="picture"
        control={control}
        render={({ field: { onChange } }) => (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e.target.files, onChange)}
              ref={fileInputRef}
              style={{ display: "none" }}
            />
            <div
              onClick={handleClick}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`hover:outline-primary h-full w-full cursor-pointer rounded-lg duration-100 ease-in-out hover:outline hover:outline-2 hover:outline-offset-2 ${
                isDragging ? "outline-primary outline outline-2 outline-offset-2" : ""
              }`}
            >
              {preview ? (
                <Avatar className="h-full w-full rounded-md">
                  <AvatarImage src={preview} alt="Avatar" className="h-full w-full" />
                </Avatar>
              ) : (
                <div
                  className={`${boxClassName} border-border flex items-center justify-center rounded-md border-2 border-dashed`}
                >
                  <Plus className="size-7" />
                </div>
              )}
            </div>
          </>
        )}
      />
    </div>
  )
}
