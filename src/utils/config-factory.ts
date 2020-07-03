import { MessengerInterface } from '../types/messenger-interface'
import { existsSync } from 'fs'
import { mapValues, pick, split } from 'lodash'
import { resolve } from 'path'
import { Config } from '../types/config'

interface ConfigFactoryInterface {
  defaultConfigPath: string
  messenger: MessengerInterface
}

export class ConfigFactory {
  protected defaultConfigPath: string

  protected messenger: MessengerInterface

  constructor({ defaultConfigPath, messenger }: ConfigFactoryInterface) {
    this.defaultConfigPath = defaultConfigPath
    this.messenger = messenger
  }

  /**
   * Read config file,
   * if path is not exists it will try to load from default config path.
   *
   * @param path
   */
  public async readConfigFile(path?: string): Promise<object> {
    if (path && !existsSync(path)) {
      this.messenger.error(`Config path: '${path}' is not exists.`)
    }

    path = path ? path : this.defaultConfigPath

    if (!existsSync(path)) {
      return {}
    }

    const result = await import(path)

    if (!(result instanceof Object)) {
      return {}
    }

    return result
  }

  /**
   * Resolve config from an object
   *
   * @param rawConfig
   */
  public resolveConfig(rawConfig: object): Partial<Config> {
    return mapValues(
      pick(rawConfig, ['source', 'destination', 'allowedExtensions']),
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
