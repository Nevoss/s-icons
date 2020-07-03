export class SIconError extends Error {
  /**
   * Create new SIconError instance.
   *
   * @param message
   */
  public static create(message: string): SIconError {
    return new SIconError(message)
  }
}
