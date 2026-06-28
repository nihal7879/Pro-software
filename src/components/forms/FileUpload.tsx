import { useState } from 'react'
import { FileUp, Paperclip, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  hint?: string
  multiple?: boolean
}

/** File upload UI (presentation only — no actual upload performed). */
export function FileUpload({ hint = 'PDF, PNG, JPG up to 10MB', multiple = true }: FileUploadProps) {
  const [files, setFiles] = useState<string[]>([])
  const [dragging, setDragging] = useState(false)

  const addFiles = (list: FileList | null) => {
    if (!list) return
    setFiles((prev) => [...prev, ...Array.from(list).map((f) => f.name)])
  }

  return (
    <div className="space-y-2">
      <label
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          addFiles(e.dataTransfer.files)
        }}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-input bg-muted/30 px-6 py-8 text-center transition-colors hover:border-primary/50',
          dragging && 'border-primary bg-accent',
        )}
      >
        <FileUp className="mb-2 size-6 text-muted-foreground" />
        <p className="text-sm font-medium">
          <span className="text-primary">Click to upload</span> or drag and drop
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
        <input type="file" multiple={multiple} className="hidden" onChange={(e) => addFiles(e.target.files)} />
      </label>
      {files.length > 0 && (
        <ul className="space-y-1.5">
          {files.map((name, i) => (
            <li
              key={`${name}-${i}`}
              className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-sm"
            >
              <span className="flex items-center gap-2 truncate">
                <Paperclip className="size-4 shrink-0 text-muted-foreground" />
                {name}
              </span>
              <button
                type="button"
                onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
