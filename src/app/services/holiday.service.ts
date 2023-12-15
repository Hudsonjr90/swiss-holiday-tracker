import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class HolidaysService {
    //Uses external API to get the holidays
    private apiUrl: string =
        'https://api.api-ninjas.com/v1/holidays?country=ch&year=';

    constructor(private http: HttpClient) {}

    /**
     * The function `getHolidaysForDate` makes an HTTP GET request to retrieve holidays for a specific
     * date.
     * @param {Date} date - The `date` parameter is of type `Date` and represents the specific date for
     * which you want to retrieve holidays.
     * @returns an HTTP GET request to the API endpoint specified by the `apiUrl` variable, with the
     * year extracted from the `date` parameter appended to the URL. The request includes a header with
     * the 'X-Api-Key' key and its corresponding value.
     */
    public getHolidaysForDate(date: Date) {
        return this.http.get(this.apiUrl + String(date.getFullYear()), {
            headers: {
                'X-Api-Key': 'pZIMFImMZSJUWk2cHl1uNQ==h7xmV8cE0SN4jhbU',
            },
        });
    }
}
