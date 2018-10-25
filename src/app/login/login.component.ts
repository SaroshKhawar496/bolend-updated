import { Component, OnInit } from '@angular/core';
// import {ApiService} from '../api.service';
// import {CustomerService} from '../customer.service';
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

	) {

	}

	ngOnInit() {
	}

	public submitLogin () : void {
		// do something here
	}

}
