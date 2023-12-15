import { DateTypeEnum } from '../enums/date-types.enum';
import { DateTypeModel } from './dateType.model';
import { HolidayModel } from './holliday.model';

export class CalendarModel {
    day: number;
    month: number;
    year: number;
    dateType: DateTypeModel;

    constructor(
        day: number = new Date().getDay(),
        month: number = new Date().getMonth(),
        year: number = new Date().getFullYear(),
        dateType: DateTypeModel = new DateTypeModel(DateTypeEnum.Work)
    ) {
        this.day = day;
        this.month = month;
        this.year = year;
        this.dateType = dateType;
    }
}
