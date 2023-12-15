export class HolidayModel {
    public country: string;
    public date: string;
    public day: string;
    public iso: string;
    public name: string;
    public type: string;
    public year: number;

    constructor(hollidayObject: {
        country: string;
        date: string;
        day: string;
        iso: string;
        name: string;
        type: string;
        year: number;
    }) {
        this.country = hollidayObject.country;
        this.date = hollidayObject.date;
        this.day = hollidayObject.day;
        this.iso = hollidayObject.iso;
        this.name = hollidayObject.name;
        this.type = hollidayObject.type;
        this.year = hollidayObject.year;
    }
}
