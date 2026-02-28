import { forwardRef } from 'react'
import type { FieldType } from '../types'
import { Pdf } from '..'

const labelClass = 'text-xs ml-1 font-semibold uppercase tracking-wide text-gray-700'
const textClass = 'h-9 bg-blue-50 px-2 py-1 text-sm text-gray-800'

interface InputFieldProps {
  name: string
  label: string
  type: FieldType
  defaultValue?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  containerClassName?: string
  containerStyle?: React.CSSProperties
  labelClassName?: string
  labelStyle?: React.CSSProperties
  textClassName?: string
  textStyle?: React.CSSProperties
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(function InputField(
  {
    name,
    label,
    type,
    defaultValue = '',
    value,
    onChange,
    onBlur,
    containerClassName = '',
    containerStyle = {},
    labelClassName = '',
    labelStyle = {},
    textClassName = '',
    textStyle = {},
  },
  ref,
) {
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
          defaultValue={value ?? defaultValue}
          className={`${textClass} ${textClassName} ${onChange !== undefined || type === 'date' ? 'invisible print:visible' : ''}`}
          style={textStyle}
        />
        {onChange !== undefined && (type === 'text' || type === 'textarea') && (
          <input
            ref={ref}
            defaultValue={value ?? defaultValue}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={label}
            className="absolute inset-0 h-full w-full bg-transparent px-2 py-1 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-400 print:hidden"
          />
        )}
        {type === 'date' && (
          <input
            ref={ref}
            type="date"
            defaultValue={value ?? defaultValue}
            onChange={onChange}
            onBlur={onBlur}
            className="absolute inset-0 h-full w-full bg-transparent px-2 py-1 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-400 print:hidden"
          />
        )}
      </div>
    </div>
  )
})
