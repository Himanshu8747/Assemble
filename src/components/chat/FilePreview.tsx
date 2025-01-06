import { X } from 'lucide-react'
interface FilePreviewProps {
  files: File[]
  onRemove: (index: number) => void
}

export function FilePreview({ files, onRemove }: FilePreviewProps) {
  if (files.length === 0) return null

  return (
    <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-t-lg">
      <div className="flex flex-wrap gap-2">
        {files.map((file, index) => (
          <div
            key={index}
            className="group relative flex items-center gap-2 bg-white dark:bg-gray-800 rounded-md p-2 pr-8 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <FileTypeIcon type={file.type} />
            <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[180px]">
              {file.name}
            </span>
            <button
              onClick={() => onRemove(index)}
              className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500 dark:hover:text-red-400"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function FileTypeIcon({ type }: { type: string }) {
  let icon = "📄"

  if (type.startsWith("image/")) {
    icon = "🖼️"
  } else if (type.startsWith("video/")) {
    icon = "🎥"
  } else if (type.startsWith("audio/")) {
    icon = "🎵"
  }

  return <span className="text-lg">{icon}</span>
}

