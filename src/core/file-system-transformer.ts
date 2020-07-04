import { existsSync, readdirSync, readFileSync, statSync } from 'fs'
import { basename, extname } from 'path'
import { Transformer } from '../types/transformer'
import { TransformedInput } from '../types/transformed-input'
import { MessengerInterface } from '../types/messenger-interface'
import { SIconError } from '../errors/s-icon-error'

/**
 * Constructor arguments for FileSystemTransformer.
 */
interface FileSystemTransformerConstructorArgs {
  allowedExtensions: string[]
  sourcePath: string
  messenger?: MessengerInterface
}

/**
 * Response to read files and transform them to js object
 */
export class FileSystemTransformer implements Transformer {
  /**
   * Will convert only those file extensions.
   */
  private readonly allowedExtensions: string[]

  /**
   * The path for the directory with all the icons.
   */
  private readonly sourcePath: string

  /**
   * Response for manage logs and errors.
   */
  protected messenger?: MessengerInterface

  /**
   * Constructor
   *
   * @param allowedExtensions
   * @param sourcePath
   * @param messenger
   */
  constructor({
    allowedExtensions,
    sourcePath,
    messenger,
  }: FileSystemTransformerConstructorArgs) {
    this.allowedExtensions = allowedExtensions
    this.sourcePath = sourcePath
    this.messenger = messenger
  }

  /**
   * Main class function.
   */
  public run(): TransformedInput {
    if (!existsSync(this.sourcePath)) {
      throw SIconError.create(
        `The icons source directory path '${this.sourcePath}' is not exists.`
      )
    }

    const stats = statSync(this.sourcePath)

    if (!stats.isDirectory()) {
      throw SIconError.create(
        `The icons source path '${this.sourcePath}' must be directory`
      )
    }

    return this.readFromDirectory(this.sourcePath)
  }

  /**
   * Read icons from directory and return all the icons as property
   * of the final object + svg string as value.
   *
   * @param path
   * @param prefix
   */
  protected readFromDirectory(path: string, prefix = ''): TransformedInput {
    return readdirSync(path).reduce((fileNamesObj, fileName) => {
      const fileFullPath = `${path}/${fileName}`

      const stats = statSync(fileFullPath)
      const ext = extname(fileFullPath)

      if (stats.isDirectory()) {
        return {
          ...fileNamesObj,
          ...this.readFromDirectory(fileFullPath, `${fileName}/`),
        }
      }

      if (!this.allowedExtensions.includes(ext)) {
        return { ...fileNamesObj }
      }

      const baseName = basename(fileName).split('.').slice(0, -1).join('.')

      return {
        ...fileNamesObj,
        [`${prefix}${baseName}`]: readFileSync(`${path}/${fileName}`).toString(
          'utf-8'
        ),
      }
    }, {})
  }
}
