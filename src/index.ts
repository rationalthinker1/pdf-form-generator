export type {
  PageSize,
  FieldType,
  PageDimensions,
  ExtractedField,
  ExtractedPage,
  ExtractedData,
  ExtractedText,
} from './types';

export { PAGE_SIZES } from './types';

import { Document } from './components/Document';
import { Page } from './components/Page';
import { TextField } from './components/TextField';
import { Text } from './components/Text';

export const Pdf = {
  Document,
  Page,
  TextField,
  Text,
} as const;

export { InputField } from './components/InputField';
