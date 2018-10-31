import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import {Router} from '@angular/router';


@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	username: string;
	password: string;

	constructor (
		private router: Router,
		private http: HttpService
	) {}

	ngOnInit() {
	}

	/**
	 * Authenticate the user
	 */
	public submitLogin () : void {
		// set the path and construct the payload
		let path = "/you/sign_in";
		let payload = {
			user: {
				email: this.username,		// this.username should be an email
				password: this.password
			}
		}
		this.http.postObservable ( path, payload ).subscribe(
			data => {
				console.log ( data );
			},
			err => {
				console.error ( err );
			}
		);
	}

}
