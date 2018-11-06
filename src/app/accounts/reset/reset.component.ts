import { Component, OnInit } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-reset',
	templateUrl: './reset.component.html',
	styleUrls: ['../accounts.component.css']
})
export class ResetComponent extends LoginComponent {
	password: string;
	token: string;
	qParamSub: Subscription;
	
	ngOnInit () {
		this.protocolCheck();
		this.qParamSub = this.route.queryParams.subscribe (
			qParams => this.token = qParams['token']
		)
	}

	submitReset() : void {
		if ( !this.token ) {
			this.alert.error ( "No token found in the URL. Please check the URL in your email." )
			return;
		} else if ( !this.password ) {
			this.alert.error ( "Password field must not be blank" );
			return;
		}

		let path: string = '/accounts/password';
		let payload: object = {
			user: {
				password: this.password,
				password_confirmation: this.password,
				reset_password_token: this.token
			}
		}
		// console.log ( payload );
		this.http.postObservable ( path, payload ).subscribe (
			data => {
				console.log (data);
				this.alert.success ( "Password updated. Please login", true );
				this.router.navigateByUrl ('accounts/login');
			},
			err => console.error(err)
		)
	}

}
