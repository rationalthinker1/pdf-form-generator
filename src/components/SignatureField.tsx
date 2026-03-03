interface SignatureFieldProps {
  name: string
  label?: string
  className?: string
  style?: React.CSSProperties
}

export function SignatureField({ name, label = 'Signature', className, style }: SignatureFieldProps) {
  return (
    <div
      data-field-name={name}
      data-field-type="signature"
      data-field-default-value=""
      className={[
        'flex h-12 items-end border-b-2 border-gray-600 pb-1',
        className,
      ].filter(Boolean).join(' ')}
      style={style}
    >
      <span className="text-xs text-gray-400 italic">{label}</span>
    </div>
  )
}
