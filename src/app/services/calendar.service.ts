import { Injectable } from '@angular/core';
import { CalendarModel } from '../models/calendar.model';
import { WeekModel } from '../models/week.model';

@Injectable({
    providedIn: 'root',
})
export class CalendarService {
    /**
     * The function `getDaysInSelectedMonth` returns the number of days in the selected month of a
     * given date.
     * @param {Date} date - The `date` parameter is a JavaScript `Date` object representing the
     * selected month for which you want to determine the number of days.
     * @returns The number of days in the selected month.
     */
    public getDaysInSelectedMonth(date: Date): number {
        const month: number = date.getMonth();
        const year: number = date.getFullYear();
        return new Date(year, month + 1, 0).getDate();
    }
    /**
     * The function `getDaysInSelectedWeek` takes a date as input and returns an array of `WeekModel`
     * objects representing the days of the week surrounding the input date.
     * @param {Date} date - The `date` parameter is a `Date` object representing a specific date.
     * @returns an array of WeekModel objects, which represent the days in the selected week.
     */
    public getDaysInSelectedWeek(date: Date): WeekModel[] {
        const currentDay: number = date.getDay();
        const daysOfWeek = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
        ];
        const daysInWeek = [];

        for (let i = 0; i < 7; i++) {
            const diff = i - currentDay;
            const nextDay = new Date(date);
            nextDay.setDate(date.getDate() + diff);
            daysInWeek.push(
                new WeekModel(nextDay, daysOfWeek[nextDay.getDay()])
            );
        }
        return daysInWeek;
    }

    /**
     * The function setDateInTimezone takes a day as input and returns a string representation of that
     * day with a specific timezone offset.
     * @param {string} day - A string representing a specific day in the format "YYYY-MM-DD".
     * @returns a string in the format `T00:00:00-03:00`.
     */
    public setDateInTimezone(day: string): string {
        return `${day}T00:00:00-03:00`;
    }

    /**
     * The function formatDateString takes in day, month, and year as parameters and returns a
     * formatted date string in the format "YYYY-MM-DD".
     * @param {number} day - The day parameter is a number representing the day of the month.
     * @param {number} month - The `month` parameter is a number representing the month of the date. It
     * should be a value between 1 and 12, where 1 represents January and 12 represents December.
     * @param {number} year - The year parameter is a number that represents the year.
     * @returns a formatted date string in the format "YYYY-MM-DD".
     */
    public formatDateString(day: number, month: number, year: number): string {
        const formatedDay: string = day < 10 ? `0${day}` : `${day}`;
        const formatedMonth: string = month < 10 ? `0${month}` : `${month}`;
        return this.setDateInTimezone(
            `${year}-${formatedMonth}-${formatedDay}`
        );
    }

    /**
     * The function `getDaysInPreviousMonth` returns an array of `CalendarModel` objects representing
     * the days in the previous month before a given date.
     * @param {number} day - The day of the month for which you want to get the previous month's days.
     * @param {number} month - The month parameter represents the current month for which you want to
     * get the previous month's days. It should be a number between 1 and 12, where 1 represents
     * January and 12 represents December.
     * @param {number} year - The year parameter represents the year for which you want to get the days
     * in the previous month.
     * @returns an array of CalendarModel objects.
     */
    public getDaysInPreviousMonth(
        day: number,
        month: number,
        year: number
    ): CalendarModel[] {
        const dateString = this.formatDateString(day, month, year);
        const dayDate = new Date(dateString);
        const dayWeekDay = dayDate.getDay();
        const calendar: CalendarModel[] = [];

        if (dayWeekDay !== 0) {
            for (let i = 0; i < dayWeekDay; i++) {
                const diff = i - dayWeekDay + 1;
                const previousMonth = new Date(
                    this.formatDateString(day, month - 1, year)
                );
                const previousMonthDays =
                    this.getDaysInSelectedMonth(previousMonth);
                const previousDay = new Date(
                    this.formatDateString(
                        previousMonthDays + diff,
                        previousMonth.getMonth() + 1,
                        previousMonth.getFullYear()
                    )
                );
                calendar.push(
                    new CalendarModel(
                        previousDay.getDate(),
                        previousDay.getMonth() + 1,
                        previousDay.getFullYear()
                    )
                );
            }
        }
        return calendar;
    }
}
