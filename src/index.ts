import { Command, flags } from '@oclif/command'
import { IConfig } from '@oclif/config'
import { FileSystemTransformer } from './core/file-system-transformer'
import { Manager } from './core/manager'
import { SvgParser } from './core/svg-parser'
import { JsonOutputHandler } from './core/json-output-handler'
import { Config } from './types/config'
import { Messenger } from './utils/messenger'
import { ConfigFactory } from './utils/config-factory'
import { SIconError } from './errors/s-icon-error'
import { CliLogger } from './utils/cli-logger'
import * as colors from './utils/colors'

class SvgToJson extends Command {
  protected defaults = {
    source: '',
    destination: process.cwd(),
    allowedExtensions: ['.svg'],
  }

  public static description = 'describe the command here'

  public static flags = {
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
    force: flags.boolean({ char: 'f' }),
    source: flags.string({
      char: 's',
      description: 'source path to svg icons directory.',
    }),
    allowedExtensions: flags.string({
      char: 'a',
      description: 'allowed extensions.',
    }),
    destination: flags.string({
      char: 'd',
      description: 'output destination path.',
    }),
    config: flags.string({
      char: 'c',
      description: 'config file.',
    }),
  }

  protected messenger: Messenger

  protected configFactory: ConfigFactory

  protected cliLogger: CliLogger

  constructor(argv: string[], config: IConfig) {
    super(argv, config)

    this.messenger = new Messenger()
    this.configFactory = new ConfigFactory({
      messenger: this.messenger,
      defaultConfigPath: `${process.cwd()}/icons.config.js`,
    })
    this.cliLogger = new CliLogger()
  }

  public async run() {
    this.cliLogger.header()

    const { flags } = this.parse(SvgToJson)

    this.listenMessenger()

    const config: Config = {
      ...this.defaults,
      ...this.configFactory.resolveConfig(
        await this.configFactory.readConfigFile(flags.config)
      ),
      ...this.configFactory.resolveConfig(flags),
    }

    if (!config.source) {
      config.source = await this.cliLogger.prompt(
        colors.info('`source`') +
          ' was not declared, please fill your icons source directory'
      )
    }

    const manager = new Manager({
      transformer: new FileSystemTransformer({
        allowedExtensions: config.allowedExtensions,
        sourcePath: config.source,
        messenger: this.messenger,
      }),
      parser: new SvgParser({ messenger: this.messenger }),
      outputHandler: new JsonOutputHandler({
        destinationPath: config.destination,
        messenger: this.messenger,
      }),
    })

    try {
      manager.transform().parse().output()
    } catch (error) {
      if (!(error instanceof SIconError)) {
        throw error
      }

      this.messenger.error(error.message)
    }

    this.cliLogger.footer()
  }

  protected listenMessenger() {
    this.messenger.listen({
      [Messenger.LOG]: (message?: string) =>
        this.cliLogger.log(message ? message : ''),
      [Messenger.ERROR]: (message?: string) =>
        this.cliLogger.die(message ? message : ''),
      [Messenger.WARN]: (message?: string) =>
        this.cliLogger.error(message ? message : ''),
    })
  }
}

export = SvgToJson
