export interface MessengerInterface {
  log(message?: string, ...args: any[]): void

  error(message?: string, ...args: any[]): void

  warn(message?: string, ...args: any[]): void

  listen(listeners: ListenersInterface): void
}

export interface ListenersInterface {
  [key: string]: {
    (message?: string, ...args: any[]): void
  }
}
