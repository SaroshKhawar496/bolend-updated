import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';


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
		let user = this.http.authenticate ( this.username, this.password );
	}

}
