import type { FieldType } from '../types'

interface TextFieldProps {
  name: string
  label?: string
  defaultValue?: string
  className?: string
  style?: React.CSSProperties
  type?: FieldType
}

const baseClass = 'relative h-9 bg-blue-50 px-2 py-1 text-sm text-gray-800'

export function TextField({ name, label, defaultValue = "", className, style, type = 'text' }: TextFieldProps) {
  return (
    <div
      data-field-name={name}
      data-field-type={type}
      data-field-default-value={defaultValue}
      className={[baseClass, className].filter(Boolean).join(' ')}
      style={style}
    >
      {defaultValue !== null
        ? <span>{defaultValue}</span>
        : <span className="text-gray-400 italic">{label ?? name}</span>
      }
    </div>
  )
}
