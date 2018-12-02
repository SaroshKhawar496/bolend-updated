import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, JWT } from './_models/models';
import { Router, RouterStateSnapshot } from '@angular/router';


// environment
import { environment } from '../environments/environment';
import { AlertService } from './utils/alert/alert.service';
import { Consts } from './_models/consts';



@Injectable({
	providedIn: 'root'
})
export class HttpService {

	constructor (
		private http: HttpClient,
		private router: Router,
		private alert: AlertService,
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
	public authenticate ( email: string, pw: string, returnUrl?: string, showAlert: boolean = true ) : void {
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
						this.router.navigateByUrl(returnUrl);
				}

				// if the attempt failed:
				else {
					// remove any currentUser entry from localStorage
					localStorage.removeItem ( HttpService.lsTokenKey );
					console.error ( 'Auth unsuccessful!' );
				}
			},
			(error: HttpErrorResponse) => {				// handle errors
				// unauthorized - bad email/password
				if ( error.status == 401 ) {
					console.error ( 'Authentication failure. Invalid email or password' );
					if ( showAlert )
						this.alert.error ( "Invalid email or password. Please try again." );
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
		this.currentUser = new User ( response.body, token );
		console.log ( 'Auth successful for:', this.currentUser );

		return true;
	}

	public initCheckToken ( token: string ) {
	}

	/**
	 * Given a JWT token, check that it is valid with the server.  
	 * If it is valid, load data about the currently authenticated user
	 * @param token 
	 */
	public async checkToken ( token: string ) {
		let path: string = "/users/you";
		let result: boolean = await new Promise<boolean>(resolve =>
			this.getObservable (path).subscribe(
				data => {
					this.currentUser = new User(data);
					resolve(true);
				},
				err => {
					// do not need to handle error if request returns error
					resolve(false);
				},
			)
		)
		return await result;
	}

	public async asyncCheckToken ( token: string ) {
		let path: string = "/users/you";
		return this.getObservable(path).toPromise();
	}


	/**
	 * Remove token from local storage, effectively logging user out. Redirect to login page
	 */
	public logout ( redirect: boolean = true ) : void {
		localStorage.removeItem ( HttpService.lsTokenKey );
		this.currentUser = new User;		// reset currentUser
		let state: RouterStateSnapshot = this.router.routerState.snapshot;
		if ( redirect )
			this.router.navigate(['/accounts/login'], { queryParams: { returnUrl: state.url }});
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

	/**
	 * Build an `Observable` for an HTTP GET request. `subscribe()` to the Observable to send request
	 * @param path API path
	 * @param headers optional request headers
	 * @param include include response headers
	 */
	getObservable ( path: string, headers?: HttpHeaders, include: boolean = false ): Observable<object> {
		let url = `${this.baseUrl}${path}`;
		let options: object = { headers: headers };
		if (include) options['observe']	= 'response';

		return this.http.get ( url, options );
	}

	/**
	 * Build an `Observable` for an HTTP POST request. `subscribe()` to the Observable to send it
	 * @param path API path
	 * @param payload payload object
	 * @param include include the response headers 
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


	/**
	 * Build an `Observable` for an HTTP PUT request. `subscribe()` to send the request
	 * @param path API path
	 * @param payload payload object
	 * @param include include the response headers?
	 */
	putObservable ( path: string, payload: object, include: boolean = false )
	: Observable<object>
	{
		// build the request
		let url = `${this.baseUrl}${path}`;
		let options: object = {};
		if (include) options['observe'] = 'response';

		let request: Observable<Object> = this.http.put ( url, payload, options );
		return request;
	}


	/**
	 * Build an `Observable` for an HTTP DELETE request. `subscribe()` to send the request
	 * @param path API path
	 * @param include include the response headers?
	 */
	deleteObservable ( path: string, include: boolean = false ) {
		// build the request
		let url = `${this.baseUrl}${path}`;
		let options: object = {};
		if (include) options['observe'] = 'response';

		let request: Observable<Object> = this.http.delete ( url, options );
		return request;
	}




	/****************************************************************
	 * Accessors/mutators
	 ****************************************************************/
	public getCurrentUser () : User { 
		return this.currentUser; 
	}


	/****************************************************************
	 * Alert messages & error handling
	 ****************************************************************/
	public static unsecureProtocolAlert = 
`This page was NOT loaded using HTTPS protocol.  
The data you submit in this form may not be safe from attackers and Russian hackers.  
Continue at your own risk.`

	/**
	 * Handle generic errors, such as 404 and 5xx errors
	 * @param err HtppErrorResponse object
	 * @param type String enum, describing the model type
	 * @returns {boolean} true if error handled; false if not
	 */
	public genericModelErrorHandler ( err: HttpErrorResponse, type?: Model ) : boolean {
		// user not found
		if ( err.error['message'] ) {		// if error response has a message, show it
			console.error ( err.error['message'] );
			this.alert.error ( err.error['message'] );
			return true;
		} else if ( err.status == 404 ) {
			console.error ( `No ${type} with this ID exists!`, err.error['exception'] );
			this.alert.error ( `No ${type} with this ID exists!`, true );
			this.router.navigate (['/404']);
			return true;
		} else if (err.status == 403 ){
			console.error ( `You are not allowed to perform this action.` );
			this.alert.error ( `You are not allowed to perform this action.` );
			return true;
		} else if ( err.status >= 500 ) {
			console.error ( Consts.serverFaultMsg );
			this.alert.error ( Consts.serverFaultMsg );
			return true;
		} else				// if none of the above have handled the error, return false
			return false;
	}

	/** Use on 404 */
	notFoundRedirect () {

	}
}

/**
 * String enum, used for error reporting
 */
export enum Model {
	User	= 'user',
	Item	= 'item',

}