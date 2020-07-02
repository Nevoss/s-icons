import { ParsedIcons } from './parsed-icon'

export interface OutputHandler {
  run(parsedIcons: ParsedIcons): any
}
