import { FileAttachment } from "../../types"

interface MessageAttachmentProps {
  file: FileAttachment
}

export function MessageAttachment({ file }: MessageAttachmentProps) {
  if (file.type.startsWith("image/")) {
    return (
      <div className="mt-2 relative group">
        <img
          src={file.url}
          alt={file.name}
          className="max-w-[400px] max-h-[300px] rounded-lg object-cover"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-sm hover:underline"
          >
            Open original
          </a>
        </div>
      </div>
    )
  }

  if (file.type.startsWith("video/")) {
    return (
      <div className="mt-2">
        <video
          src={file.url}
          controls
          className="max-w-[400px] max-h-[300px] rounded-lg"
        />
      </div>
    )
  }

  return (
    <a
      href={file.url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-md p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors max-w-sm"
    >
      <span className="text-lg">📄</span>
      <span className="text-sm text-blacks dark:text-white truncate">
        {file.name}
      </span>
    </a>
  )
}

