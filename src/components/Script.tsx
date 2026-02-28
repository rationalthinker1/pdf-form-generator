interface ScriptProps {
  children: string
}

export function Script({ children }: ScriptProps) {
  return (
    <script
      data-pdf-script
      type="text/pdf-acrobat-js"
      style={{ display: 'none' }}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: children }}
    />
  )
}
