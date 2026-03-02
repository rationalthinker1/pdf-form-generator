import { useState, type ChangeEvent } from 'react'
import type { FieldType } from '../types'
import { Pdf } from '..'

const labelClass = 'text-xs ml-1 font-semibold uppercase text-gray-700 text-[9px]'
const textClass = 'h-9 bg-blue-50 px-2 py-1 text-sm text-gray-800'

interface InputFieldProps {
  name: string
  label: string
  type: FieldType
  value?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
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
  value: valueProp,
  onChange: onChangeProp,
  defaultValue = '',
  containerClassName = '',
  containerStyle = {},
  labelClassName = '',
  labelStyle = {},
  textClassName = '',
  textStyle = {},
}: InputFieldProps) {
  const [localValue, setLocalValue] = useState(defaultValue)
  const controlled = valueProp !== undefined
  const value = controlled ? valueProp : localValue
  const onChange = controlled ? onChangeProp! : (e: ChangeEvent<HTMLInputElement>) => setLocalValue(e.target.value)

  return (
    <div className={containerClassName || 'w-auto flex-1'} style={containerStyle}>
      <div>
        <Pdf.Text className={`${labelClass} ${labelClassName}`} style={labelStyle}>
          {label}
        </Pdf.Text>
      </div>
      <Pdf.TextField
          name={name}
          label={label}
          type={type}
          defaultValue={value}
          onChange={onChange}
          className={`${textClass} ${textClassName} invisible`}
          style={textStyle}
        />
    </div>
  )
}
