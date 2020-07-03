import { HTMLElement, parse, Node } from 'node-html-parser'
import { Parser } from '../types/parser'
import { TransformedInput } from '../types/transformed-input'
import { ParsedIcons } from '../types/parsed-icon'
import { mapValues, omit } from 'lodash'
import { MessengerInterface } from '../types/messenger-interface'

interface SvgParserConstructorArgs {
  messenger?: MessengerInterface
}

export class SvgParser implements Parser {
  protected messenger?: MessengerInterface

  constructor({ messenger }: SvgParserConstructorArgs = {}) {
    this.messenger = messenger
  }

  run(transformedInput: TransformedInput): ParsedIcons {
    return mapValues(transformedInput, (content) => {
      return this.parseElement(parse(content).childNodes[0])
    })
  }

  parseElement(element: Node): any {
    if (!(element instanceof HTMLElement)) {
      return null
    }

    return {
      tagName: element.tagName,
      attributes: {
        ...omit(element.attributes, ['width', 'height']),
        ...(element.attributes.stroke && { stroke: 'currentColor' }),
        ...(element.attributes.fill && { fill: 'currentColor' }),
      },
      children:
        element.childNodes.length > 0
          ? element.childNodes
              .map((element: Node) => this.parseElement(element))
              .filter((element?: HTMLElement) => element)
          : [],
    }
  }
}
