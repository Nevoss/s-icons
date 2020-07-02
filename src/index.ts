import { Command, flags } from '@oclif/command'
import { FileSystemTransformer } from './core/file-system-transformer'
import { Manager } from './core/manager'
import { SvgParser } from './core/svg-parser'
import { JsonOutputHandler } from './core/json-output-handler'
import { pathExistsSync } from 'fs-extra'
import { Config } from './types/config'
import { pick, mapValues, split } from 'lodash'
import { resolve } from 'path'

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
      default: '',
    }),
  }

  public static args = []

  public async run() {
    const { flags } = this.parse(SvgToJson)

    const resolvedConfig: Config = {
      ...this.defaults,
      ...this.resolveConfig(await this.readConfig(flags.config)),
      ...this.resolveConfig(flags),
    }

    if (!resolvedConfig.source) {
      this.error('Must have source.')
    }

    const manager = new Manager({
      transformer: new FileSystemTransformer({
        allowedExtensions: resolvedConfig.allowedExtensions,
        sourcePath: resolvedConfig.source,
      }),
      parser: new SvgParser(),
      outputHandler: new JsonOutputHandler({
        destinationPath: resolvedConfig.destination,
      }),
    })

    return manager.transform().parse().output()
  }

  public async readConfig(configPath: string) {
    if (configPath && !pathExistsSync(configPath)) {
      this.error(`'${configPath}' is not exists.`)
    }

    configPath = configPath ? configPath : `${process.cwd()}/icons.config.js`

    if (!pathExistsSync(configPath)) {
      return {}
    }

    const result = await import(configPath)

    if (!(result instanceof Object)) {
      return {}
    }

    return result
  }

  public resolveConfig(data: object) {
    return mapValues(
      pick(data, ['source', 'destination', 'allowedExtensions']),
      (value, key) => {
        if (key === 'allowedExtensions' && typeof value === 'string') {
          return split(value, ',')
        }

        if (['source', 'destination'].includes(key)) {
          return resolve(value)
        }

        return value
      }
    )
  }
}

export = SvgToJson
