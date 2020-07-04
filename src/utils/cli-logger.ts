import { pkg } from '../consts'
import * as colors from './colors'
import * as emoji from './emoji'
import { cli } from 'cli-ux'

export class CliLogger {
  public log(...messages: string[]): CliLogger {
    // eslint-disable-next-line no-console
    console.log('   ', ...messages)

    return this
  }

  public header(): CliLogger {
    return this.log().log(colors.bold(pkg.name), colors.info(pkg.version))
  }

  public footer(): CliLogger {
    return this.log()
  }

  public error(...messages: string[]): CliLogger {
    this.log()

    // eslint-disable-next-line no-console
    console.error('   ', emoji.no, colors.error(messages.join(' ')))

    return this
  }

  public prompt(question: string): Promise<any> {
    return cli.prompt('    ' + question)
  }

  public die(...messages: string[]): void {
    messages.length && this.error(...messages)

    this.footer()

    // eslint-disable-next-line no-process-exit,unicorn/no-process-exit
    process.exit(1)
  }
}
