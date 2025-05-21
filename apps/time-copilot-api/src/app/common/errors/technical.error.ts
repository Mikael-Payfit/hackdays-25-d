export abstract class TechnicalError extends Error {
  constructor(message: string) {
    super(message)
  }
}
