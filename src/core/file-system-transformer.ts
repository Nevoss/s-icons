import { pathExistsSync, readdirSync, readFileSync, statSync } from 'fs-extra'
import { basename, extname } from 'path'
import { Transformer } from '../types/transformer'
import { TransformedInput } from '../types/transformed-input'

interface FileSystemTransformerConstructorArgs {
  allowedExtensions: string[]
  sourcePath: string
}

export class FileSystemTransformer implements Transformer {
  private readonly allowedExtensions: string[]

  private readonly sourcePath: string

  constructor({
    allowedExtensions,
    sourcePath,
  }: FileSystemTransformerConstructorArgs) {
    this.allowedExtensions = allowedExtensions
    this.sourcePath = sourcePath
  }

  public run(): TransformedInput {
    if (!pathExistsSync(this.sourcePath)) {
      throw new Error(`The path '${this.sourcePath}' is not exists.`)
    }

    const stats = statSync(this.sourcePath)

    if (!stats.isDirectory()) {
      throw new Error(`The path '${this.sourcePath}' must be directory`)
    }

    return this.readFromDirectory(this.sourcePath)
  }

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
