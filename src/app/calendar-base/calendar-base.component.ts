import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { take } from 'rxjs';
import { CalendarDayComponent } from '../calendar-day/calendar-day.component';
import { CalendarTypeEnum } from '../enums/calendar-types.enum';
import { DateTypeEnum } from '../enums/date-types.enum';
import { CalendarModel } from '../models/calendar.model';
import { CantonModel } from '../models/canton.model';
import { DateTypeModel } from '../models/dateType.model';
import { HolidayModel } from '../models/holliday.model';
import { CalendarService } from '../services/calendar.service';
import { HolidaysService } from '../services/holiday.service';
import { ToolbarComponent } from '../toolbar/toolbar.component';

@Component({
    selector: 'app-calendar-base',
    standalone: true,
    imports: [ToolbarComponent, CalendarDayComponent, CommonModule],
    templateUrl: './calendar-base.component.html',
    styleUrl: './calendar-base.component.scss',
})
export class CalendarBaseComponent {
    public selectedDays: CalendarModel[] = [];
    public monthsInYear: CalendarModel[][] = [];
    public selectedDay: Date | null = null;
    public selectedCanton: CantonModel | null = null;
    public calendarType: string | null = null;
    public dateTypeEnum = DateTypeEnum;
    public readonly monthNames: string[] = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    public readonly daysOfTheWeekNames = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];
    public allCalendarTypes = CalendarTypeEnum;

    constructor(
        private holidaysService: HolidaysService,
        private calendarService: CalendarService
    ) {}

    /**
     * The function sets the selected days in a calendar model and then retrieves the holidays for
     * those days.
     * @param {CalendarModel[]} numberOfDaysRecieved - An array of CalendarModel objects representing
     * the selected days.
     */
    public setSelectedDays(numberOfDaysRecieved: CalendarModel[]): void {
        this.selectedDays = numberOfDaysRecieved;
        this.getHolidays();
    }

    /**
     * The function sets the calendar type.
     * @param {string} calendarType - The parameter `calendarType` is a string that represents the type
     * of calendar.
     */
    public setCalendarType(calendarType: string): void {
        this.calendarType = calendarType;
    }

    /**
     * The function sets the selected canton to the provided canton or null.
     * @param {CantonModel | null} canton - The `canton` parameter is of type `CantonModel` or `null`.
     */
    public setSelectedCanton(canton: CantonModel | null): void {
        this.selectedCanton = canton;
    }

    /**
     * The function sets the selected day to a new Date object and then calls the getHolidays function.
     * @param {string} day - The parameter "day" is a string representing a specific day.
     */
    public setSelectedDay(day: string): void {
        this.selectedDay = new Date(
            this.calendarService.setDateInTimezone(day)
        );
        this.getHolidays();
    }

    /**
     * The function `setDaysToShow` takes a `CalendarModel` object and returns the name of the day of
     * the week for the given date.
     * @param {CalendarModel} day - The "day" parameter is an object of type "CalendarModel" which
     * represents a specific day in a calendar. It contains the following properties:
     * @returns the name of the day of the week for the given date.
     */
    public setDaysToShow(day: CalendarModel): string {
        const dateString = this.calendarService.formatDateString(
            day.day,
            day.month,
            day.year
        );
        const weekDay = new Date(dateString).getDay();
        return this.daysOfTheWeekNames[weekDay];
    }

    public getWeekDay(): number {
        return this.selectedDay ? this.selectedDay.getDay() : 0;
    }

    /**
     * The function `getHolidays()` retrieves holidays for a selected day and maps them to a specific
     * model.
     */
    private getHolidays() {
        if (this.selectedDay) {
            this.holidaysService
                .getHolidaysForDate(this.selectedDay)
                .pipe(take(1))
                .subscribe((holidays) => {
                    this.mapHolidays(holidays as HolidayModel[]);
                });
        }
    }

    /**
     * The function `mapHolidays` takes in a list of holiday models and maps them to the selected days
     * based on the calendar type.
     * @param {HolidayModel[]} holidays - An array of HolidayModel objects.
     */
    private mapHolidays(holidays: HolidayModel[]): void {
        let holidaysList: HolidayModel[] = [];

        if (this.calendarType === this.allCalendarTypes.day) {
            holidaysList = this.getHolidaysForDay(holidays);
        } else if (this.calendarType === this.allCalendarTypes.month) {
            holidaysList = this.getHolidaysForMonth(holidays);
        } else if (this.calendarType === this.allCalendarTypes.week) {
            holidaysList = this.getHolidaysForWeek(holidays);
        } else if (this.calendarType === this.allCalendarTypes.year) {
            this.monthsInYear = [];
            let holidaysForYear: HolidayModel[] = [];

            for (let month in this.monthNames) {
                const holidaysForMonth: HolidayModel[] =
                    this.getHolidaysForYear(Number(month) + 1, holidays);
                holidaysForYear = holidaysForYear.concat(holidaysForMonth);
            }
            holidaysList = holidaysForYear;
            this.breakDaysIntoMonths();
        }

        for (let day of this.selectedDays) {
            this.setWeekends(day);
            this.matchHolidayToDate(day, holidaysList);
        }
    }

    /**
     * The function `getHolidaysForDay` takes an array of holiday objects and returns an array
     * containing the holiday object for the selected day, if it exists.
     * @param {HolidayModel[]} holidayList - An array of objects representing holidays. Each object should
     * have a "date" property representing the date of the holiday.
     * @returns an array of HolidayModel objects. If a holiday is found for the selected day, it will
     * return an array containing that holiday. Otherwise, it will return an empty array.
     */
    private getHolidaysForDay(holidayList: HolidayModel[]): HolidayModel[] {
        const holiday = holidayList.find(
            (date) =>
                this.selectedDay?.toDateString() ===
                new Date(
                    this.calendarService.setDateInTimezone(date.date)
                ).toDateString()
        );
        return holiday ? [holiday] : [];
    }

    /**
     * The function `getHolidaysForWeek` takes a list of holidays and returns only the holidays that
     * fall within the selected days of the week.
     * @param {HolidayModel[]} holidayList - An array of HolidayModel objects, which represents a list
     * of holidays.
     * @returns an array of HolidayModel objects that fall within the selected week.
     */
    private getHolidaysForWeek(holidayList: HolidayModel[]): HolidayModel[] {
        const holidaysInMonth = this.getHolidaysForMonth(holidayList);
        const holidaysInWeek: HolidayModel[] = [];
        const daysInWeek: number[] = [];

        this.selectedDays.forEach((day) => daysInWeek.push(day.day));

        for (const holiday of holidaysInMonth) {
            const holidayDay = new Date(
                this.calendarService.setDateInTimezone(holiday.date)
            ).getDate();

            if (daysInWeek.includes(holidayDay)) {
                holidaysInWeek.push(holiday);
            }
        }
        return holidaysInWeek;
    }

    /**
     * The function `getHolidaysForMonth` filters a list of holidays based on the month of a selected
     * day.
     * @param {HolidayModel[]} holidayList - An array of holiday objects, where each object has a
     * "date" property representing the date of the holiday.
     * @returns an array of HolidayModel objects that correspond to the selected month.
     */
    private getHolidaysForMonth(holidayList: HolidayModel[]): HolidayModel[] {
        const holidayMonth = holidayList.filter(
            (date) =>
                new Date(
                    this.calendarService.setDateInTimezone(date.date)
                ).getMonth() +
                    1 ===
                (this.selectedDay ? this.selectedDay?.getMonth() + 1 : false)
        );
        return holidayMonth;
    }
    private getHolidaysForYear(
        month: number,
        holidayList: HolidayModel[]
    ): HolidayModel[] {
        const holidayMonth = holidayList.filter(
            (date) =>
                new Date(
                    this.calendarService.setDateInTimezone(date.date)
                ).getMonth() +
                    1 ===
                month
        );
        return holidayMonth;
    }

    /**
     * The function `matchHolidayToDate` checks if a given day matches any holiday in a list and sets
     * the `dateType` property of the day accordingly.
     * @param {CalendarModel} day - The "day" parameter is an instance of the CalendarModel class,
     * which represents a specific day in a calendar. It contains properties such as year, month, day,
     * and dateType.
     * @param {HolidayModel[]} holidayList - An array of objects representing holidays. Each object
     * should have a "date" property representing the date of the holiday.
     */
    private matchHolidayToDate(
        day: CalendarModel,
        holidayList: HolidayModel[]
    ) {
        for (let holiday of holidayList) {
            const holidayDate = new Date(
                this.calendarService.setDateInTimezone(holiday.date)
            );
            if (
                day.year === holidayDate.getFullYear() &&
                day.month === holidayDate.getMonth() + 1 &&
                day.day === holidayDate.getDate()
            ) {
                day.dateType = new DateTypeModel(
                    this.dateTypeEnum.Holiday,
                    holiday
                );
            }
        }

        this.setDaysToShow(day);
    }

    /**
     * The function sets the date type of a given day to either "Pto" (for weekends) or "Work" (for
     * weekdays).
     * @param {CalendarModel} day - The parameter "day" is an object of type CalendarModel.
     */
    private setWeekends(day: CalendarModel) {
        const date = new Date(
            this.calendarService.formatDateString(day.day, day.month, day.year)
        );

        if (date.getDay() === 0 || date.getDay() === 6) {
            day.dateType = new DateTypeModel(this.dateTypeEnum.Pto);
        } else {
            day.dateType = new DateTypeModel(this.dateTypeEnum.Work);
        }
    }

    /**
     * The function "breakDaysIntoMonths" takes an array of selected days and breaks them into separate
     * arrays for each month of the year.
     */
    private breakDaysIntoMonths() {
        for (let monthIndex = 1; monthIndex <= 12; monthIndex++) {
            const daysInMonth: CalendarModel[] = [];

            for (let day of this.selectedDays) {
                if (day.month === monthIndex) {
                    daysInMonth.push(day);
                }
            }
            const currentDay: number = daysInMonth[0].day;
            const currentYear: number = daysInMonth[0].year;
            this.calendarService
                .getDaysInPreviousMonth(currentDay, monthIndex, currentYear)
                .reverse()
                .forEach((day) => daysInMonth.unshift(day));
            this.monthsInYear.push(daysInMonth);
        }
    }
}
