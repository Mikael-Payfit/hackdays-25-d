import { IsDefined, IsString } from 'class-validator'

export type RolledbackValue = {
  key: string
  droppedValue: unknown
  restoredValue: unknown
}

export class RolledbackValueDefinition {
  @IsString()
  @IsDefined()
  public key: string

  @IsDefined()
  public droppedValue: unknown

  @IsDefined()
  public restoredValue: unknown

  constructor(input: RolledbackValue) {
    this.key = input.key
    this.droppedValue = input.droppedValue
    this.restoredValue = input.restoredValue
  }
}
