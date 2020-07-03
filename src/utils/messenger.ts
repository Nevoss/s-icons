import { forEach } from 'lodash'
import { ListenersInterface } from '../types/messenger-interface'
import { EventEmitter } from 'events'

export class Messenger {
  public static LOG = 'log'

  public static ERROR = 'error'

  public static WARN = 'warn'

  protected eventEmitter: EventEmitter

  constructor() {
    this.eventEmitter = new EventEmitter()
  }

  public log(message?: string, ...args: any[]): void {
    this.eventEmitter.emit(Messenger.LOG, message, ...args)
  }

  public error(message?: string, ...args: any[]): void {
    this.eventEmitter.emit(Messenger.ERROR, message, ...args)
  }

  public warn(message?: string, ...args: any[]): void {
    this.eventEmitter.emit(Messenger.WARN, message, ...args)
  }

  public listen(listeners: ListenersInterface) {
    forEach(listeners, (value, key) => {
      this.eventEmitter.on(key, value)
    })
  }
}
