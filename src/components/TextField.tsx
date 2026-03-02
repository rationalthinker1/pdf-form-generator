import type { FieldType } from '../types'

interface TextFieldProps {
  name: string
  label?: string
  defaultValue?: string
  className?: string
  containerClassName?: string
  style?: React.CSSProperties
  type?: FieldType
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const baseClass = 'relative h-9 bg-blue-50 px-2 py-1 text-sm text-gray-800'
const baseContainerClassName = 'relative';

export function TextField({ name, label, defaultValue = "", className = "", containerClassName = "", style, type = 'text', onChange }: TextFieldProps) {
  return (
    <div className={[baseContainerClassName, containerClassName].filter(Boolean).join(' ')}>
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
      <input
        type={type === 'date' ? 'date' : 'text'}
        value={defaultValue}
        onChange={onChange}
        className={[
          'absolute inset-0 h-full w-full px-2 py-1 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-400 print:hidden',
          type === 'date' ? 'bg-transparent' : 'bg-blue-50',
        ].join(' ')}
      />
    </div>
  )
}
