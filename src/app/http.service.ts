import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './_models/user';

// environment
import { environment } from '../environments/environment';


@Injectable({
	providedIn: 'root'
})
export class HttpService {

	constructor (
		private http: HttpClient
	) {}

	private baseUrl: string = environment.baseUrl;
	private authPath: string = "/you/sign_in";
	private currentUser: User = new User;


	/****************************************************************
	 * Auth
	 ****************************************************************/

	 /**
	  * Attempt to authenticate the user using the credentials provided
	  * @param email email
	  * @param pw password
	  */
	public authenticate ( email: string, pw: string ) : void {
		// construct the request URL and payload
		let url = `${this.baseUrl}${this.authPath}`;
		let payload = {
			user: {
				email: email,		// this.username should be an email
				password: pw
			}
		}

		// make the request
		this.http.post ( url, payload, { observe: 'response' } ).subscribe (
			response => {
				// check that the auth attempt was OK; if so:
				if ( response.ok ){
					// get JWT from header and store it in localStorage; save user info in currentUser
					let token: string = response.headers.get('Authorization');
					localStorage.setItem ( 'currentUser', token );
					// for ( var f in response.body[f] )
					// 	this.currentUser[f] = response.body[f];
					// console.log ( 'Auth successful.', token, this.currentUser );
				}

				// if the attempt failed:
				else {
					// remove any currentUser entry from localStorage
					localStorage.removeItem ( 'currentUser' );
					console.error ( 'Auth unsuccessful!' );
				}
			}
		)
	}


	/****************************************************************
	 * Generic requests
	 ****************************************************************/

	/**
	 * Get the base URL to build the API on top of
	 */
	public getBaseApiUrl (): string {
		return this.baseUrl;
	}

	getObservable ( path: string ): Observable<object> {
		let url = `${this.baseUrl}${path}`;
		return this.http.get ( url );
	}

	postObservable ( path: string, payload: object ) : Observable<object> {
		let url = `${this.baseUrl}${path}`;
		return this.http.post (url, payload);
	}


	updateCurrentUser ( user: object | User ) : void {

	}



	/****************************************************************
	 * Accessors/mutators
	 ****************************************************************/
	public getCurrentUser () : User { return this.currentUser; }
}
