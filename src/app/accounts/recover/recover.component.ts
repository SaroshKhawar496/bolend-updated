import { Component, OnInit } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'app-recover',
	templateUrl: './recover.component.html',
	styleUrls: [ '../accounts.component.css' ]
})
export class RecoverComponent extends LoginComponent {

	email: string;

	ngOnInit (  ) {

	}

	/**
	 * Submit password recovery request to server
	 */
	submitRecover () {
		let path: string = "/accounts/password";
		let payload: object = { user: { email: this.email } };
		this.http.postObservable ( path, payload ).subscribe (
			res => {		// success
				console.log ('submitRecover()', res );
				this.alert.success ( "An email has been sent to you, containing a link to reset your password" );
			},
			(err: HttpErrorResponse) => {
				console.error(err);
				if ( err.status == 422 ) {
					this.alert.error ( "The email you entered does not exist. Please try again" );
				}
			}
		)
	}
}
