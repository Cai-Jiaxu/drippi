// components/SelectField.tsx
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from './ui/select'

interface SelectFieldProps {
  id: string
  label: string
  value: string
  onChange: (val: string) => void
  options: { id: number; name: string }[]
}

export const SelectField = ({ id, label, value, onChange, options }: SelectFieldProps) => (
  <div>
    <label htmlFor={id} className="block mb-1 text-[var(--foreground)] font-medium">
      {label}
    </label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)]">
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent
        side="bottom"
        sideOffset={4}
        className="bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-md shadow-lg z-50"
      >
        {options.map((cat) => (
          <SelectItem key={cat.id} value={String(cat.id)}>
            {cat.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
)
