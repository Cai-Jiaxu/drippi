"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Upload } from "lucide-react"

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface FileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, multiple = false, accept, onChange, ...props }, ref) => {
    const [fileNames, setFileNames] = React.useState<string[]>([])

    function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
      const files = e.target.files
      if (files) setFileNames(Array.from(files).map((f) => f.name))
      onChange?.(e)
    }

    const labelText = multiple
      ? fileNames.length
        ? `${fileNames.length} file${fileNames.length > 1 ? "s" : ""}`
        : "Choose files"
      : fileNames[0] || "Choose file"

    return (
      <div className={cn("inline-flex flex-col space-y-1", className)}>
        <label className="cursor-pointer">
          <input
            type="file"
            ref={ref}
            className="sr-only"
            multiple={multiple}
            accept={accept}
            onChange={handleFiles}
            {...props}
          />
          <div
            className={cn(
              // **Apply file-input classes here** on the inner div
              "file-input file-input-bordered",
              "flex items-center space-x-2 rounded-md",
              "px-3 py-2 bg-base-100 text-base-content",
              className // any extra sizing (e.g. !w-auto) can be passed in
            )}
          >
            <Upload className="h-5 w-5 text-primary" />
            <span className="truncate">{labelText}</span>
          </div>
        </label>

        {fileNames.length > 0 && (
          <ul className="pl-1 text-sm text-muted-foreground space-y-0.5">
            {fileNames.map((name) => (
              <li key={name} className="truncate">
                {name}
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }
)
FileInput.displayName = "FileInput"
