import { WeekDay } from '@payfit/common-time-model'

export const JETLANG_COMPANY_SERVICE_INTERFACE =
  'JETLANG_COMPANY_SERVICE_INTERFACE'

export type CompanyWorkweekPlanning = Record<
  WeekDay,
  {
    isJourOuvre: boolean
    isJourOuvrable: boolean
    planned: boolean
  }
>

export interface JetLangCompanyServiceInterface {
  getCompanyWorkweekPlanning(
    jlCompanyId: string,
  ): Promise<CompanyWorkweekPlanning>
}
