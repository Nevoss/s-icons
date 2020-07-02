export interface ParsedIcon {
  tagName: string
  attributes: { [key: string]: string }
  children: ParsedIcon[]
}

export interface ParsedIcons {
  [key: string]: ParsedIcon
}
