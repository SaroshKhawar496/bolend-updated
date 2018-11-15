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
	 * @param id 
	 */
	public requestItem ( id: number ) : Observable<object> {
		let path: string = "/requests";
		let payload: object = { id: id }
		return this.http.postObservable ( path, payload );
	}
}
