// components/InputField.tsx
import { Input } from './ui/input'

interface InputFieldProps {
  id: string
  label: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  required?: boolean
  step?: string
}

export const InputField = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  step,
}: InputFieldProps) => (
  <div>
    <label htmlFor={id} className="block mb-1 text-[var(--foreground)] font-medium">
      {label}
    </label>
    <Input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)]"
      required={required}
      step={step}
    />
  </div>
)
