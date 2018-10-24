import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// environment
import { environment } from '../environments/environment';


@Injectable({
	providedIn: 'root'
})
export class HttpService {

	constructor (
		private http: HttpClient
	) {}

	private baseUrl = environment.baseUrl;

	/**
	 * Get the base URL to build the API on top of
	 */
	public getBaseApiUrl (): string {
		return this.baseUrl;
	}

	httpGetObservable ( url: string ): Observable<object> {

		return this.http.get ( url );
	}
}
