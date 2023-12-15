import { DateTypeEnum } from '../enums/date-types.enum';
import { HolidayModel } from './holliday.model';

export class DateTypeModel {
    dateType: DateTypeEnum;
    holiday: HolidayModel | null;

    constructor(dateType: DateTypeEnum, holiday: HolidayModel | null = null) {
        this.dateType = dateType;
        this.holiday = holiday;
    }
}
