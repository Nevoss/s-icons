import { OutputHandler } from '../types/output-handler'
import { ParsedIcons } from '../types/parsed-icon'
import { statSync, writeFileSync } from 'fs'

interface JsonOutputHandlerConstructorArgs {
  destinationPath: string
}

export class JsonOutputHandler implements OutputHandler {
  private readonly destinationPath: string

  private readonly defaultFileName: string = 'icons.json'

  constructor({ destinationPath }: JsonOutputHandlerConstructorArgs) {
    this.destinationPath = destinationPath
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
