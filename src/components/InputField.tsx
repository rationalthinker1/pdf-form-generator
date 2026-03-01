import { useState } from 'react'
import type { FieldType } from '../types'
import { Pdf } from '..'

const labelClass = 'text-xs ml-1 font-semibold uppercase text-gray-700'
const textClass = 'h-9 bg-blue-50 px-2 py-1 text-sm text-gray-800'

interface InputFieldProps {
  name: string
  label: string
  type: FieldType
  defaultValue?: string
  containerClassName?: string
  containerStyle?: React.CSSProperties
  labelClassName?: string
  labelStyle?: React.CSSProperties
  textClassName?: string
  textStyle?: React.CSSProperties
}

export function InputField({
  name,
  label,
  type,
  defaultValue = '',
  containerClassName = '',
  containerStyle = {},
  labelClassName = '',
  labelStyle = {},
  textClassName = '',
  textStyle = {},
}: InputFieldProps) {
  const [value, setValue] = useState(defaultValue)

  return (
    <div className={`w-auto flex-1 ${containerClassName}`} style={containerStyle}>
      <div>
        <Pdf.Text className={`${labelClass} ${labelClassName}`} style={labelStyle}>
          {label}
        </Pdf.Text>
      </div>
      <div className="relative">
        <Pdf.TextField
          name={name}
          label={label}
          type={type}
          defaultValue={value}
          className={`${textClass} ${textClassName} invisible`}
          style={textStyle}
        />
        <input
          type={type === 'date' ? 'date' : 'text'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={[
            'absolute inset-0 h-full w-full px-2 py-1 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-400 print:hidden',
            type === 'date' ? 'bg-transparent' : 'bg-blue-50',
          ].join(' ')}
        />
      </div>
    </div>
  )
}
