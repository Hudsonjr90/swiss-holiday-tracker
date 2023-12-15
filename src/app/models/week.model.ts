export class WeekModel {
    date: Date;
    dayOfWeek: string;

    constructor(date: Date, dayOfWeek: string) {
        this.date = date;
        this.dayOfWeek = dayOfWeek;
    }
}
