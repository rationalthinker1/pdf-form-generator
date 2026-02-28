export type PageSize = 'letter' | 'a4'

export type FieldType = 'text' | 'textarea' | 'date' | 'checkbox' | 'dropdown'

export interface ExtractedText {
  text: string
  pageIndex: number
  x: number
  y: number
  width: number
  height: number
  fontSize: number
  bold: boolean
  color: string
}

export interface PageDimensions {
  widthPx: number
  heightPx: number
  widthPt: number
  heightPt: number
}

export const PAGE_SIZES: Record<PageSize, PageDimensions> = {
  letter: { widthPx: 816, heightPx: 1056, widthPt: 612, heightPt: 792 },
  a4:     { widthPx: 794, heightPx: 1123, widthPt: 595, heightPt: 842 },
};


/** All coordinates are in pixels, relative to the Page container's top-left corner. */
export interface ExtractedField {
  name: string
  type: FieldType
  pageIndex: number
  x: number
  y: number
  width: number
  height: number
  defaultValue?: string
}

export interface ExtractedPage {
  widthPx: number
  heightPx: number
  widthPt: number
  heightPt: number
  fields: ExtractedField[]
  texts: ExtractedText[]
  boxes: ExtractedBox[]
}

export interface ExtractedBox {
  pageIndex: number
  x: number
  y: number
  width: number
  height: number
  borderWidth?: number
}

export interface ExtractedData {
  pages: ExtractedPage[]
}
