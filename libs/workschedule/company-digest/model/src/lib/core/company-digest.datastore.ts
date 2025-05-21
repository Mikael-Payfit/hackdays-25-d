import { TimeSlot, WeekDay } from '@payfit/common-time-model'
import { defaultLunchBreakTimeSlot } from './company-digest.constants'

export interface Contract {
  jlContractId: string
}

export interface Collaborator {
  collaboratorId: string
  contracts: Contract[]
}

export interface CompanyDayParams {
  day: WeekDay
  lunchBreakTimeSlot: TimeSlot
}

export interface CompanyDigestDatastore {
  collaborators: Collaborator[]
  weekParams: CompanyDayParams[]
  defaultWorkschedulePattern?: {
    workschedulePatternRegistryId: string
    workschedulePatternRegistryVersion: number
    workschedulePatternRecordId: string
  }
}

export function getEmptyCompanyDigestDatastore(
  collaborators: Collaborator[],
): CompanyDigestDatastore {
  return {
    collaborators,
    weekParams: [
      {
        day: 'monday',
        lunchBreakTimeSlot: defaultLunchBreakTimeSlot,
      },
      {
        day: 'tuesday',
        lunchBreakTimeSlot: defaultLunchBreakTimeSlot,
      },
      {
        day: 'wednesday',
        lunchBreakTimeSlot: defaultLunchBreakTimeSlot,
      },
      {
        day: 'thursday',
        lunchBreakTimeSlot: defaultLunchBreakTimeSlot,
      },
      {
        day: 'friday',
        lunchBreakTimeSlot: defaultLunchBreakTimeSlot,
      },
      {
        day: 'saturday',
        lunchBreakTimeSlot: defaultLunchBreakTimeSlot,
      },
      {
        day: 'sunday',
        lunchBreakTimeSlot: defaultLunchBreakTimeSlot,
      },
    ],
  }
}
