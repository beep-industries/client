import { createContext, useContext, useRef, useState } from "react"
import { Avatar, AvatarImage } from "./ui/Avatar"
import { Controller, useForm, type Control, type UseFormHandleSubmit } from "react-hook-form"

interface PictureFormProps {
  children: React.ReactNode
  className?: string
}

interface PicturePreviewProps {
  children: React.ReactNode
  className?: string
}

interface FormValues {
  picture: FileList
}

interface PictureFormContextProps {
  control: Control<FormValues, unknown, FormValues>
  handleSubmit: UseFormHandleSubmit<FormValues, FormValues>
}

const PictureFormContext = createContext<PictureFormContextProps>({} as PictureFormContextProps)

export function PictureForm({ children, className }: PictureFormProps) {
  const { control, handleSubmit } = useForm<FormValues>()
  return (
    <PictureFormContext.Provider value={{ control, handleSubmit }}>
      <form className={className}>{children}</form>
    </PictureFormContext.Provider>
  )
}

export function PicturePreview({ children, className }: PicturePreviewProps) {
  const [preview, setPreview] = useState<string>()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { control } = useContext(PictureFormContext)
  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={className}>
      <Controller
        name="picture"
        control={control}
        render={({ field: { onChange } }) => (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) {
                setPreview(URL.createObjectURL(e.target.files[0]))
                onChange(e.target.files)
              }
            }}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
        )}
      />
      <div
        onClick={handleClick}
        className="hover:outline-primary w-fit cursor-pointer rounded-lg duration-100 ease-in-out hover:outline hover:outline-2 hover:outline-offset-2"
      >
        {preview ? (
          <Avatar className="h-full w-full items-center justify-center rounded-md">
            <AvatarImage src={preview} alt="Avatar" />
          </Avatar>
        ) : (
          children
        )}
      </div>
    </div>
  )
}
