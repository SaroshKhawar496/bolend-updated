import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, JWT } from './_models/user';
import { Router } from '@angular/router';


// environment
import { environment } from '../environments/environment';



@Injectable({
	providedIn: 'root'
})
export class HttpService {

	constructor (
		private http: HttpClient,
		private router: Router
	) {}

	private baseUrl: string = environment.baseUrl;
	private authPath: string = "/accounts/sign_in";
	private currentUser: User = new User;
	public static lsTokenKey: string = 'currentUser';			// access the JWT in localStorage with this key



	/****************************************************************
	 * Auth
	 ****************************************************************/

	/**
	 * Attempt to authenticate the user using the credentials provided
	 * @param email email
	 * @param pw password
	 */
	public authenticate ( email: string, pw: string, returnUrl?: string ) : void {
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
					// extract the token (JWT) from the headers
					let extractRes: ReturnType<HttpService['extractJWT']> = this.extractJWT ( response );

					// navigate to return URL if it is provided and token extraction was OK
					if ( extractRes && returnUrl )
						this.router.navigate([returnUrl]);
				}

				// if the attempt failed:
				else {
					// remove any currentUser entry from localStorage
					localStorage.removeItem ( HttpService.lsTokenKey );
					console.error ( 'Auth unsuccessful!' );
				}
			}
		);
	}

	/**
	 * Extract JWT from HttpResponse headers
	 * @param response full HttpResponse object. MUST include headers! Call request methods with `include` set to true
	 */
	public extractJWT ( response: HttpResponse<object> ) : boolean {
		// get JWT from header and store it in localStorage; save user info in currentUser
		let token: string = response.headers.get('Authorization');
		if ( !token )
			return false;
		localStorage.setItem ( HttpService.lsTokenKey, token );
		
		// save information about the currently authenticated user
		this.currentUser = Object.assign ( this.currentUser, response.body );
		this.currentUser.jwt = new JWT ( token );
		console.log ( 'Auth successful for:', this.currentUser );

		return true;
	}


	public checkToken ( token: string ) : boolean {
		return true;
	}

	/**
	 * Remove token from local storage, effectively logging user out
	 */
	public logout () : void {
		localStorage.removeItem ( HttpService.lsTokenKey );
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

	/**
	 * Build an `Observable` for an HTTP POST request. `subscribe()` to the Observable to send it
	 * @param path API path
	 * @param payload payload object
	 * @param include include the request headers 
	 */
	postObservable ( path: string, payload: object, include: boolean = false ) 
	: Observable<Object>
	{
		// build the request
		let url = `${this.baseUrl}${path}`;
		let options: object = {};
		if (include) options['observe'] = 'response';

		let request: Observable<Object> = this.http.post (url, payload, options);
		return request;
	}


	updateCurrentUser ( user: object | User ) : void {

	}



	/****************************************************************
	 * Accessors/mutators
	 ****************************************************************/
	public getCurrentUser () : User { 
		return this.currentUser; 
	}


	/****************************************************************
	 * Alert messages
	 ****************************************************************/
	public static unsecureProtocolAlert = 
`This page was NOT loaded using HTTPS protocol.  
The data you submit in this form may not be safe from attackers and Russian hackers.  
Are you sure you want to submit? 
Note: your browser may block this submission regardless of what you choose`


}
