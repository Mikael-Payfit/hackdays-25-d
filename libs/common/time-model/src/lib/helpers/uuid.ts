import { v4 as uuidV4 } from 'uuid'

export function generateNewEntityId(): string {
  return uuidV4()
}
