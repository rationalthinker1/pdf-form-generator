import { useState } from 'react'

interface CheckboxFieldProps {
  name: string
  defaultChecked?: boolean
  className?: string
  style?: React.CSSProperties
}

export function CheckboxField({ name, defaultChecked = false, className, style }: CheckboxFieldProps) {
  const [checked, setChecked] = useState(defaultChecked)

  return (
    <div
      data-field-name={name}
      data-field-type="checkbox"
      data-field-default-value={String(checked)}
      className={['w-4 h-4 border border-gray-600 flex items-center justify-center cursor-pointer select-none', className].filter(Boolean).join(' ')}
      style={style}
      onClick={() => setChecked(c => !c)}
    >
      {checked && (
        <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="1.5,6 4.5,9 10.5,3" />
        </svg>
      )}
    </div>
  )
}
