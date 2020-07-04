import * as chalk from 'chalk'

/**
 * Applies colors to emphasize
 *
 * @param {...string} messages
 */
export const bold = (...messages: string[]) => {
  return chalk.bold(...messages)
}

/**
 * Applies colors to inform
 *
 * @param {...string} messages
 */
export const info = (...messages: string[]) => {
  return chalk.bold.cyan(...messages)
}

/**
 * Applies colors to signify error
 *
 * @param {...string} messages
 */
export const error = (...messages: string[]) => {
  return chalk.bold.red(...messages)
}

/**
 * Applies colors to represent a command
 *
 * @param {...string} messages
 */
export const command = (...messages: string[]) => {
  return chalk.bold.magenta(...messages)
}

/**
 * Applies colors to represent a file
 *
 * @param {...string} messages
 */
export const file = (...messages: string[]) => {
  return chalk.bold.magenta(...messages)
}
