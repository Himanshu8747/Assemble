import { Button } from "@/components/ui/button"
import { ImageIcon, FileIcon } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

interface FileInputProps {
  onFileSelect: (files: FileList | null) => void
  type: 'media' | 'document'
  inputRef: React.RefObject<HTMLInputElement>
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg']
const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain'
]

export function FileInput({ onFileSelect, type, inputRef }: FileInputProps) {
  const { toast } = useToast()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files?.length) return

    const allowedTypes = type === 'media' 
      ? [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES]
      : ALLOWED_DOCUMENT_TYPES

    const invalidFiles = Array.from(files).filter(
      file => !allowedTypes.includes(file.type)
    )

    if (invalidFiles.length > 0) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: `Only ${type === 'media' ? 'images and videos' : 'documents'} are allowed`
      })
      event.target.value = ''
      return
    }

    onFileSelect(files)
  }

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileSelect}
        className="hidden"
        multiple
        accept={type === 'media' 
          ? "image/*,video/*" 
          : ".pdf,.doc,.docx,.xls,.xlsx,.txt"}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="hover:bg-gray-200 dark:hover:bg-gray-700"
        onClick={() => inputRef.current?.click()}
      >
        {type === 'media' ? (
          <ImageIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        ) : (
          <FileIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        )}
      </Button>
    </>
  )
}

