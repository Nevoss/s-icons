import { Transformer } from '../types/transformer'
import { Parser } from '../types/parser'
import { OutputHandler } from '../types/output-handler'
import { TransformedInput } from '../types/transformed-input'
import { ParsedIcons } from '../types/parsed-icon'

interface ManagerDependencies {
  transformer: Transformer
  parser: Parser
  outputHandler: OutputHandler
}

export class Manager {
  protected readonly transformer: Transformer

  protected readonly parser: Parser

  protected readonly outputHandler: OutputHandler

  protected input?: any

  protected transformedInput?: TransformedInput

  protected parsedIcons?: ParsedIcons

  constructor({ transformer, parser, outputHandler }: ManagerDependencies) {
    this.transformer = transformer
    this.parser = parser
    this.outputHandler = outputHandler
  }

  public transform(): Manager {
    this.transformedInput = this.transformer.run()

    return this
  }

  public parse(): Manager {
    if (!this.transformedInput) {
      throw new Error('You must transform an input before decode it.')
    }

    this.parsedIcons = this.parser.run(this.transformedInput)

    return this
  }

  public output(): Manager {
    if (!this.parsedIcons) {
      throw new Error(
        'You must transformed and decode an input before output it.'
      )
    }

    this.outputHandler.run(this.parsedIcons)

    return this
  }
}
