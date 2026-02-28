interface TextFieldProps {
  name: string
  label?: string
  defaultValue?: string
  className?: string
  style?: React.CSSProperties
}

export function TextField({ name, label, defaultValue, className, style }: TextFieldProps) {
  const baseClass = 'min-h-[24px] border border-gray-400 bg-white px-2 py-1 text-sm text-gray-800';
  const baseStyle: React.CSSProperties = {};

  return (
    <div
      data-field-name={name}
      data-field-type="text"
      data-field-default-value={defaultValue}
      className={[baseClass, className].filter(Boolean).join(' ')}
      style={{...baseStyle, ...style}}
    >
      {defaultValue ?? (
        <span className="text-gray-400 italic">{label ?? name}</span>
      )}
    </div>
  );
}
