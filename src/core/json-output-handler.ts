import { OutputHandler } from '../types/output-handler'
import { ParsedIcons } from '../types/parsed-icon'
import { statSync, writeFileSync } from 'fs'
import { MessengerInterface } from '../types/messenger-interface'

interface JsonOutputHandlerConstructorArgs {
  destinationPath: string
  messenger?: MessengerInterface
}

export class JsonOutputHandler implements OutputHandler {
  private readonly destinationPath: string

  private readonly defaultFileName: string = 'icons.json'

  protected messenger?: MessengerInterface

  constructor({
    destinationPath,
    messenger,
  }: JsonOutputHandlerConstructorArgs) {
    this.destinationPath = destinationPath
    this.messenger = messenger
  }

  run(parsedIcons: ParsedIcons): void {
    let destinationPath = this.destinationPath

    const stats = statSync(destinationPath)

    if (stats.isDirectory()) {
      destinationPath = `${destinationPath}/${this.defaultFileName}`
    }

    writeFileSync(destinationPath, JSON.stringify(parsedIcons))
  }
}
