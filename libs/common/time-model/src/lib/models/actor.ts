export const systemActor: Actor = {
  id: 'system',
  name: 'system',
  role: 'system',
}

export type Actor =
  | System
  | {
      id: string
      name: string
      role: Role
    }

export type System = {
  id: 'system'
  name: 'system'
  role: 'system'
}

export type HumanRole = 'manager' | 'admin' | 'employee'

export type Role = HumanRole | System['role']
