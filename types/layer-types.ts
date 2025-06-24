export interface BaseLayer {
  id: string
  name: string
  visible: boolean
  locked?: boolean
  x: number
  y: number
  width: number
  height: number
  zIndex: number
  opacity: number
  rotation?: number
  parentId?: string // For grouped layers
  isMask?: boolean // Identifies if this layer is acting as a mask
  maskedBy?: string // ID of the layer that is masking this one
}

export interface ImageLayer extends BaseLayer {
  type: "image"
  color?: string
  imageUrl?: string
}

export interface TextLayer extends BaseLayer {
  type: "text"
  content?: string
  color?: string
  fontSize?: number
  fontColor?: string
  fontFamily?: string
  fontWeight?: "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900"
  fontStyle?: "normal" | "italic"
  textDecoration?: "none" | "underline" | "line-through"
  textAlign?: "left" | "center" | "right" | "justify"
  lineHeight?: number
  letterSpacing?: number
}

export interface GroupLayer extends BaseLayer {
  type: "group"
  expanded?: boolean
  children: string[] // Array of child layer IDs
}

export type Layer = ImageLayer | TextLayer | GroupLayer

export interface LayerHierarchy {
  layer: Layer
  children: LayerHierarchy[]
  depth: number
}
