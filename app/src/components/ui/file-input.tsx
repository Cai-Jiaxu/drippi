'use client';

import React, {
  forwardRef,
  ChangeEvent,
  useState,
  MouseEvent,
} from 'react';
import { cn } from '@/lib/utils';
import { Upload, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface FileInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  (
    {
      className,
      label = 'Choose files',
      multiple = false,
      accept,
      onChange,
      ...props
    },
    ref
  ) => {
    const [files, setFiles] = useState<File[]>([]);

    const handleFiles = (e: ChangeEvent<HTMLInputElement>) => {
      const selected = Array.from(e.target.files || []);
      setFiles(selected);
      if (onChange) onChange(e);
    };

    const removeFile = (idx: number) => (e: MouseEvent) => {
      e.preventDefault();
      setFiles((prev) => prev.filter((_, i) => i !== idx));
    };

    const labelText =
      files.length === 0
        ? label
        : files.length === 1
        ? files[0].name
        : `${files.length} files selected`;

    return (
      <div>
        <label className="cursor-pointer block">
          <input
            type="file"
            ref={ref}
            className="sr-only peer"
            multiple={multiple}
            accept={accept}
            onChange={handleFiles}
            {...props}
          />
          <div
            className={cn(
              'file-input file-input-bordered w-full min-w-0',
              'flex items-center space-x-2 rounded-md',
              'px-3 py-2 bg-base-100 text-base-content',
              'peer-focus:ring-2 peer-focus:ring-primary',
              className
            )}
          >
            <Upload className="h-5 w-5 text-primary" />
            <span className="truncate">{labelText}</span>
          </div>
        </label>

        {files.length > 0 && (
          <div className="mt-2 grid grid-cols-2 gap-2">
            {files.map((file, i) => (
              <Badge
                key={i}
                className="flex items-center justify-between w-full min-w-0 px-2 py-0.1"
              >
                <span className="truncate w-full">{file.name}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={removeFile(i)}
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    );
  }
);

FileInput.displayName = 'FileInput';

export default FileInput;
