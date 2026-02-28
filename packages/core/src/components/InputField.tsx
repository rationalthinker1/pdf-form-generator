import { forwardRef } from 'react';
import type { FieldType } from '../types';
import { Pdf } from '..';

interface InputFieldProps {
    name: string
    label: string,
    type: FieldType
    defaultValue?: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
    containerClassName?: string
    containerStyle?: React.CSSProperties,
    labelClassName?: string
    labelStyle?: React.CSSProperties
    textClassName?: string
    textStyle?: React.CSSProperties
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(function InputField({
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
}, ref) {
    const baseClassName = 'w-auto flex-1';
    const baseStyle: React.CSSProperties = {};
    return (
        <div className={`${baseClassName} ${containerClassName}`} style={{...baseStyle, ...containerStyle}}>
            <div>
                <Pdf.Text className={labelClassName} style={{...labelStyle}}>{label}</Pdf.Text>
            </div>
            <div className="relative">
                {(type === 'text' || type === 'textarea' || type === 'date') && (
                    <Pdf.TextField name={name} label={label} defaultValue={value ?? defaultValue} className={textClassName} style={{...textStyle, ...(onChange !== undefined || type === 'date' ? { color: 'transparent' } : {})}} />
                )}
                {onChange !== undefined && (type === 'text' || type === 'textarea') && (
                    <input
                        ref={ref}
                        defaultValue={value ?? defaultValue}
                        onChange={onChange}
                        onBlur={onBlur}
                        placeholder={label}
                        className="absolute inset-0 h-full w-full bg-transparent px-2 py-1 text-sm text-gray-800 outline-none"
                    />
                )}
                {type === 'date' && (
                    <input
                        ref={ref}
                        type="date"
                        defaultValue={value ?? defaultValue}
                        onChange={onChange}
                        onBlur={onBlur}
                        className="absolute inset-0 h-full w-full bg-transparent px-2 py-1 text-sm text-gray-800 outline-none"
                    />
                )}
            </div>
        </div>
    );
});