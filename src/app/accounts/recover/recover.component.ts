import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';

@Component({
	selector: 'app-recover',
	templateUrl: './recover.component.html',
	styleUrls: [ '../accounts.component.css' ]
})
export class RecoverComponent implements OnInit {

	username: string;

	constructor (
		private http: HttpService
	) { }

	ngOnInit() {

	}


	/**
	 * Submit password recovery request to server
	 */
	submitRecover () {

	}
}
