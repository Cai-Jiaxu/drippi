"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Upload } from "lucide-react"

export type FileInputProps = React.InputHTMLAttributes<HTMLInputElement>

export const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, onChange, multiple = false, accept, ...props }, ref) => {
    const [fileNames, setFileNames] = React.useState<string[]>([])

    function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
      const files = e.target.files
      if (files) {
        const names = Array.from(files).map((f) => f.name)
        setFileNames(names)
      }
      onChange?.(e)
    }

    return (
      <div className={cn("flex flex-col space-y-2", className)}>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="file"
            ref={ref}
            className="sr-only"
            onChange={handleFiles}
            multiple={multiple}
            accept={accept}
            {...props}
          />
          <Button className="btn btn-outline btn-sm !px-3 !py-1">
            <Upload className="mr-2 h-4 w-4" />
            {fileNames.length > 0
              ? fileNames.length > 1
                ? `${fileNames.length} files selected`
                : fileNames[0]
              : "Choose file" + (multiple ? "s" : "")}
          </Button>
        </label>
        {fileNames.length > 0 && (
          <ul className="space-y-1 text-sm text-muted-foreground">
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
