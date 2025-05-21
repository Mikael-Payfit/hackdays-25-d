import { BusinessError } from '@payfit/common-time-model'

export class OverlappingLeaveError extends BusinessError {
  constructor() {
    super(
      'It is not possible to add/update the leave. It is overlapping with an existing leave.',
    )
  }
}
