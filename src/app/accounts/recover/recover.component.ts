import { Component, OnInit } from '@angular/core';
import { LoginComponent } from '../login/login.component';

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
			res => {
				console.log ('submitRecover()', res );
			}
		)
	}
}
