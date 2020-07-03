import { Command, flags } from '@oclif/command'
import { IConfig } from '@oclif/config'
import { FileSystemTransformer } from './core/file-system-transformer'
import { Manager } from './core/manager'
import { SvgParser } from './core/svg-parser'
import { JsonOutputHandler } from './core/json-output-handler'
import { Config } from './types/config'
import { Messenger } from './utils/messenger'
import { ConfigFactory } from './utils/config-factory'
import { SIconError } from './s-icon-error'

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

  public static args = []

  protected messenger: Messenger

  protected configFactory: ConfigFactory

  constructor(argv: string[], config: IConfig) {
    super(argv, config)

    this.messenger = new Messenger()
    this.configFactory = new ConfigFactory({
      messenger: this.messenger,
      defaultConfigPath: `${process.cwd()}/icons.config.js`,
    })
  }

  public async run() {
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
      this.messenger.error(
        '`source` must be declared (as CLI flag or in icons.config.js file).'
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
      return manager.transform().parse().output()
    } catch (error) {
      if (!(error instanceof SIconError)) {
        throw error
      }

      this.error(error.message)
    }
  }

  protected listenMessenger() {
    this.messenger.listen({
      [Messenger.LOG]: (message?: string) => this.log(message),
      [Messenger.ERROR]: (message?: string) =>
        this.error(message ? message : ''),
      [Messenger.WARN]: (message?: string) => this.warn(message ? message : ''),
    })
  }
}

export = SvgToJson
