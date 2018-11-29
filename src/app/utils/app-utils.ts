import * as moment from 'moment';


/**
 * Get the time difference between now and a specified Date as a string.  
 * If the time difference is over 1 week ()
 * @param date specified Date instance
 */
export function timeDelta ( date: Date ) : string {
    // create a moment.js instance with the date specified
    let dateMoment = moment(date);

    // determine the time difference in milliseconds between now and date specified
    let diff: number = dateMoment.diff(Date.now());

    // if the time difference is over 1 week, return the date as a formatted string
    if ( Math.abs(diff) > 6.048e+8 ) 
        return dateMoment.format("MMM Do YYYY");

    // otherwise, return the fromNow() difference
    else 
        return dateMoment.fromNow();
}



export interface Pagination {
	page: number;
	perpage: number;
	total_results?: number;
    total_pages?: number;
    
    path?: string;          // use this path string when repeating the query with updated page numbers
}