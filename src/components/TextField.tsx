interface TextFieldProps {
  name: string
  label?: string
  defaultValue?: string
  className?: string
  style?: React.CSSProperties
}

const baseClass = 'h-9 bg-blue-50 px-2 py-1 text-sm text-gray-800'

export function TextField({ name, label, defaultValue, className, style }: TextFieldProps) {
  return (
    <div
      data-field-name={name}
      data-field-type="text"
      data-field-default-value={defaultValue}
      className={[baseClass, className].filter(Boolean).join(' ')}
      style={style}
    >
      {defaultValue ?? <span className="text-gray-400 italic">{label ?? name}</span>}
    </div>
  )
}
