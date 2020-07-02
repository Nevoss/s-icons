export interface Config {
  source: string
  destination: string
  allowedExtensions: string[]
  [key: string]: any
}
