import { Component, OnInit } from '@angular/core';
import { LoginComponent } from '../login/login.component';
// import { HttpService } from 'src/app/http.service';

@Component({
	selector: 'app-recover',
	templateUrl: './recover.component.html',
	styleUrls: [ '../accounts.component.css' ]
})
export class RecoverComponent extends LoginComponent {

	username: string;

	ngOnInit() {

	}

	/**
	 * Submit password recovery request to server
	 */
	submitRecover () {

	}
}
