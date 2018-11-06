import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpService } from '../http.service';
import { AlertService } from './alert/alert.service';
import { Consts } from '../_models/consts';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor (
		private http: HttpService,
		private alert: AlertService,
	) {}

	/**
	 * Intercept HTTP responses to check for any errors; if 401 error, user is "logged out".  
	 * All other errors are re-thrown to not interfere with error handling
	 * @param request HttpRequest<any>
	 * @param next HttpHandler
	 */
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(request).pipe(catchError(err => {

			if ( err.status == 0 ) {
				this.alert.error ( "Could not connect to server. Either the server or your Internet connection is down." );
			}

			// do not apply this logic to requests from 'accounts' family (login, register, etc.)
			else if (err.status === 401 && request.url.search('accounts') === -1) {
				// auto logout if 401 response returned from api
				this.alert.info ( "Please log in to view this page.", true );
				this.http.logout();
			}

			else if ( err.status >= 500 ) {
				this.alert.error ( Consts.serverFaultMsg );
				console.error ( err );
			}
			
			// const error = err.error.message || err.statusText;
			const error = err;
			return throwError(error);
		}));
	}

}