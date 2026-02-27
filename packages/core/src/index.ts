export type {
  PageSize,
  FieldType,
  PageDimensions,
  ExtractedField,
  ExtractedPage,
  ExtractedData,
} from './types'

export { PAGE_SIZES } from './types'
export { useDocumentContext } from './context/DocumentContext'

import { Document } from './components/Document'
import { Page } from './components/Page'
import { TextField } from './components/TextField'

export const Pdf = {
  Document,
  Page,
  TextField,
} as const
