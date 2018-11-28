import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class RequestService {

	constructor (
		protected http: HttpService,
	) { }


	/**
	 * Submit a request for an item
	 * @param id item id
	 */
	public requestItem ( id: number, days:number=7 ) : Observable<object> {
		let path: string = "/requests";
		let payload: object = { 
			id: id,
			days: days
		}
		return this.http.postObservable ( path, payload );
	}

	/**
	 * Accept an incoming item request with the specified id, and loan out the item
	 * @param id request id; NOT the item id
	 * @param days how many days the item should be loaned out for; default=7
	 */
	public acceptItemRequest ( id: number | string, days:number=7 ) : Observable<object> {
		let path: string = '/loans';
		let payload: object = {
			request_id: +id,
			days: days
		};
		return this.http.postObservable (path, payload);
	}

	/**
	 * Decline an incoming item request with the specified id
	 * @param id request id; NOT the item id
	 */
	public declineItemRequest ( id: number | string ) : Observable<object> {
		let path: string = '/requests/decline';
		let payload: object = {
			id: id,
		}
		return this.http.postObservable (path, payload);
	}
}
