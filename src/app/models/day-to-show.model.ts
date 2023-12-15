import { CalendarModel } from './calendar.model';

export class DayToShowModel extends CalendarModel {
    dayOfTheWeek: string;

    constructor(dayOfTheWeek: string) {
        super();
        this.dayOfTheWeek = dayOfTheWeek;
    }
}
