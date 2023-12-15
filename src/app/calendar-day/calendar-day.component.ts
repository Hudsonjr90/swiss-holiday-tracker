import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { CalendarTypeEnum } from '../enums/calendar-types.enum';
import { DateTypeEnum } from '../enums/date-types.enum';
import { CalendarModel } from '../models/calendar.model';
import { CantonModel } from '../models/canton.model';
import { CalendarService } from '../services/calendar.service';

@Component({
    selector: 'app-calendar-day',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './calendar-day.component.html',
    styleUrl: './calendar-day.component.scss',
})
export class CalendarDayComponent implements OnInit {
    @Input() calendarType: string | null = null;
    @Input() month: number | null = null;
    @Input() selectedCanton: CantonModel | null = null;
    @Input() selectedDay: Date | null = null;

    @Input() dayToShow: CalendarModel | null = null;
    public dayToShowAsDate: Date | null = null;
    public dayToShowWeekDay: number = 0;
    public readonly allCalendarTypes = CalendarTypeEnum;
    public readonly allDateTypes = DateTypeEnum;

    constructor(private calendarService: CalendarService) {}

    ngOnInit(): void {
        if (this.dayToShow) {
            this.dayToShowAsDate = new Date(
                this.calendarService.formatDateString(
                    this.dayToShow.day,
                    this.dayToShow.month,
                    this.dayToShow.year
                )
            );
            this.dayToShowWeekDay = this.dayToShowAsDate.getDay();
        }
    }

    /**
     * The function sets the classes for a calendar element based on its type and date.
     * @returns a string that represents the classes to be applied to an element.
     */
    public setClasses(): string {
        let classList: string = '';
        if (this.calendarType === this.allCalendarTypes.month) {
            classList = `${classList} is-month`;
        } else if (this.calendarType === this.allCalendarTypes.year) {
            classList = `${classList} is-year`;
        }
        if (this.dayToShow?.dateType.dateType === this.allDateTypes.Holiday) {
            classList = `${classList} holiday`;
        } else if (
            this.dayToShow?.dateType.dateType === this.allDateTypes.Pto
        ) {
            classList = `${classList} pto`;
        } else if (
            this.dayToShow?.dateType.dateType === this.allDateTypes.Work
        ) {
            classList = `${classList} work`;
        }
        if (this.dayToShow?.month !== this.month) {
            classList = `${classList} disabled`;
        } else if (this.dayToShow?.day % 2 === 0) {
            classList = `${classList} darken`;
        }
        if (this.calendarType === this.allCalendarTypes.year) {
            classList = `${classList} has-tooltip`;
        }
        if (this.dayToShowWeekDay === 0) {
            classList = `${classList} right`;
        } else if (this.dayToShowWeekDay === 6) {
            classList = `${classList} left`;
        }
        if (this.dayToShow && this.dayToShow.day > 18) {
            classList = `${classList} top`;
        }
        return classList;
    }
}
