import { ParsedIcons } from './parsed-icon'
import { TransformedInput } from './transformed-input'

export interface Parser {
  run: {
    (transformedInput: TransformedInput): ParsedIcons
  }
}
