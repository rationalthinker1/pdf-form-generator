export type {
  PageSize,
  FieldType,
  PageDimensions,
  ExtractedField,
  ExtractedPage,
  ExtractedData,
  ExtractedText,
  ExtractedBox,
} from './types';

export { PAGE_SIZES } from './types';

import { Document } from './components/Document';
import { Page } from './components/Page';
import { TextField } from './components/TextField';
import { Text } from './components/Text';
import { Box } from './components/Box';
import { Script } from './components/Script';
import { CheckboxField } from './components/CheckboxField';
import { Footer } from './components/Footer';

export const Pdf = {
  Document,
  Page,
  TextField,
  Text,
  Box,
  Script,
  CheckboxField,
  Footer,
} as const;

export { InputField } from './components/InputField';
