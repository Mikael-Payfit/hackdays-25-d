import {
  DateWithMoment,
  DateWithMomentHelper,
} from '../../../../common/models';

export type LeavePeriod = {
  begin: DateWithMoment;
  end: DateWithMoment;
};

export class LeavePeriodHelper {
  public static NBR_MONTHS_IN_THE_PAST = 1;

  public static getInvalidationErrors(leavePeriod: LeavePeriod): string[] {
    const errors: string[] = [];
    if (!LeavePeriodHelper.isEndDateAfterBeginDate(leavePeriod)) {
      errors.push('End date must be after Begin date');
    }
    return errors;
  }
  public static isValid(leavePeriod: LeavePeriod): boolean {
    if (!LeavePeriodHelper.isEndDateAfterBeginDate(leavePeriod)) {
      return false;
    }
    return true;
  }

  public static isEquals(
    leavePeriod1: LeavePeriod,
    leavePeriod2: LeavePeriod
  ): boolean {
    return (
      DateWithMomentHelper.isEquals(leavePeriod1.begin, leavePeriod2.begin) &&
      DateWithMomentHelper.isEquals(leavePeriod1.end, leavePeriod2.end)
    );
  }

  public static isOverlapping(
    leavePeriod1: LeavePeriod,
    leavePeriod2: LeavePeriod
  ): boolean {
    const isEndPeriodEqual = DateWithMomentHelper.isEquals(
      leavePeriod1.end,
      leavePeriod2.end
    );
    const isPeriodInBetween =
      DateWithMomentHelper.isBefore(leavePeriod1.begin, leavePeriod2.end) &&
      DateWithMomentHelper.isAfter(leavePeriod1.end, leavePeriod2.end);
    const isInBetweenThePeriod =
      DateWithMomentHelper.isAfter(leavePeriod1.end, leavePeriod2.begin) &&
      DateWithMomentHelper.isBefore(leavePeriod1.end, leavePeriod2.end);

    return isEndPeriodEqual || isPeriodInBetween || isInBetweenThePeriod;
  }

  public static isEndDateAfterBeginDate(leavePeriod: LeavePeriod): boolean {
    return DateWithMomentHelper.isAfterOrEqual(
      leavePeriod.end,
      leavePeriod.begin
    );
  }
}
