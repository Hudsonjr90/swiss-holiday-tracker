import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarTypeEnum } from '../enums/calendar-types.enum';
import { CalendarTypesType } from '../models/calendar-types.type';
import { CalendarModel } from '../models/calendar.model';
import { CantonModel } from '../models/canton.model';
import { CalendarService } from '../services/calendar.service';
import { CantonService } from '../services/canton.service';

@Component({
    selector: 'app-toolbar',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './toolbar.component.html',
    styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent implements OnInit {
    @Output() numberOfDaysToShow: EventEmitter<CalendarModel[]> =
        new EventEmitter();
    @Output() cantonToShow: EventEmitter<CantonModel | null> =
        new EventEmitter();
    @Output() calendarType: EventEmitter<string> = new EventEmitter();
    @Output() selectedDay: EventEmitter<string> = new EventEmitter();

    public cantonList: CantonModel[] = [];
    public calendarEnum: CalendarTypesType = CalendarTypeEnum;
    public ammountOfDays: string[] = Object.values(CalendarTypeEnum);
    public daysToShow: string = this.calendarEnum.year;
    public selectedDate: string = new Date().toLocaleDateString('en-US');
    public selectedCanton: CantonModel | null = null;
    private calendar: CalendarModel[] = [];

    constructor(
        private cantonService: CantonService,
        private calendarService: CalendarService
    ) {
        this.getCantons();
    }

    ngOnInit() {
        this.selectedDay.emit(
            this.selectedDate.replace(/(\d\d)\/(\d\d)\/(\d{4})/, '$3-$1-$2')
        );
        this.setNumberOfDaysToShow(this.daysToShow);
    }

    /**
     * The function sets the number of days to show in a calendar and generates the corresponding
     * calendar model based on the selected date and calendar type.
     * @param {CalendarTypeEnum} numberOfDays - The `numberOfDays` parameter is of type
     * `CalendarTypeEnum`, which is an enumeration representing different types of calendar views.
     */
    public setNumberOfDaysToShow(numberOfDays: string) {
        const formatedDate = this.selectedDate.replace(
            /(\d\d)\/(\d\d)\/(\d{4})/,
            '$3-$1-$2'
        );
        const date = new Date(
            this.calendarService.setDateInTimezone(formatedDate)
        );
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        this.daysToShow = numberOfDays;
        this.calendar = [];
        this.calendarType.emit(numberOfDays);

        if (numberOfDays === CalendarTypeEnum.day) {
            this.calendar = [new CalendarModel(date.getDate(), month, year)];
        } else if (numberOfDays === CalendarTypeEnum.week) {
            this.setDaysInWeek(date, month, year);
        } else if (numberOfDays === CalendarTypeEnum.month) {
            this.setDaysInMonth(date, month, year);
        } else if (numberOfDays === CalendarTypeEnum.year) {
            for (let i = 1; i <= 12; i++) {
                const monthDate = new Date(
                    this.calendarService.formatDateString(1, i, year)
                );
                this.setDaysInMonth(monthDate, i, year);
            }
        }
        this.numberOfDaysToShow.emit(this.calendar);
    }

    /**
     * The function emits the selected Canton code.
     * @param {CantonModel} code - The code parameter is of type CantonModel.
     */
    public emitSelectedCanton(code: CantonModel) {
        this.cantonToShow.emit(code);
    }

    /**
     * The function updates the selected date and sets the number of days to show.
     * @param {string} date - The `date` parameter is a string that represents a specific date.
     */
    public updateDates(date: string) {
        this.selectedDate = date;
        this.selectedDay.emit(this.selectedDate);
        this.setNumberOfDaysToShow(this.daysToShow);
    }

    /**
     * The getCantons function retrieves a list of cantons from a service, creates CantonModel objects
     * for each canton, assigns the first canton as the selected canton, and emits the selected canton.
     */
    private getCantons(): void {
        this.cantonService.getCantons().subscribe((cantons) => {
            cantons.results.forEach((canton) =>
                this.cantonList.push(new CantonModel(canton))
            );
            this.selectedCanton = this.cantonList[0];
            this.emitSelectedCanton(this.selectedCanton);
        });
    }

    /**
     * The function sets the days in a month based on the given date, month, and year.
     * @param {Date} date - The `date` parameter is of type `Date` and represents the current date.
     * @param {number} month - The month parameter is a number representing the month of the year. It
     * should be a value between 1 and 12, where 1 represents January and 12 represents December.
     * @param {number} year - The year parameter is the year for which you want to set the days in the
     * month.
     */
    private setDaysInMonth(date: Date, month: number, year: number): void {
        const daysInMonth = this.calendarService.getDaysInSelectedMonth(date);
        for (let day = 1; day < daysInMonth + 1; day++) {
            if (day === 1 && this.daysToShow !== this.calendarEnum.year) {
                this.getDaysInPreviousMonth(day, month, year);
            }
            this.calendar.push(new CalendarModel(day, month, year));
        }
    }

    /**
     * The function sets the days in a week for a given date, month, and year.
     * @param {Date} date - The date parameter is a Date object representing a specific date within the
     * week for which you want to set the days in the calendar.
     * @param {number} month - The month parameter is a number that represents the month of the year.
     * It is used to set the month value for each CalendarModel object in the calendar array.
     * @param {number} year - The year parameter is the year for which you want to set the days in the
     * week.
     */
    private setDaysInWeek(date: Date, month: number, year: number): void {
        this.calendarService.getDaysInSelectedWeek(date).forEach((day) => {
            this.calendar.push(
                new CalendarModel(day.date.getDate(), month, year)
            );
        });
    }

    /**
     * The function retrieves the number of days in the previous month given a specific day, month, and
     * year.
     * @param {number} day - The day parameter represents the day of the month.
     * @param {number} month - The month parameter represents the current month for which you want to
     * get the previous month's days. It is a number that represents the month, where January is 1,
     * February is 2, and so on.
     * @param {number} year - The year parameter represents the year for which you want to get the days
     * in the previous month.
     */
    private getDaysInPreviousMonth(day: number, month: number, year: number) {
        this.calendar = this.calendarService.getDaysInPreviousMonth(
            day,
            month,
            year
        );
    }
}
