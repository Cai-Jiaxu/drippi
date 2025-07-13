// components/FileInputField.tsx -- for image upload
import FileInput from './ui/file-input'

interface FileInputFieldProps {
  id: string
  label: string
  value: File[]
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const FileInputField = ({ id, label, value, onChange }: FileInputFieldProps) => (
  <div>
    <label htmlFor={id} className="block mb-1 text-[var(--foreground)] font-medium">
      {label}
    </label>
    <FileInput
      id={id}
      multiple
      accept=".jpeg,.jpg,.png,.svg"
      onChange={onChange}
      required
    />
  </div>
)
