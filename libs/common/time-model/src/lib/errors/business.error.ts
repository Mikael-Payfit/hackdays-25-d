export abstract class BusinessError extends Error {
  constructor(message: string) {
    super(message)
  }
}
