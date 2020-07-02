import { TransformedInput } from './transformed-input'

export interface Transformer {
  run: {
    (): TransformedInput
  }
}
