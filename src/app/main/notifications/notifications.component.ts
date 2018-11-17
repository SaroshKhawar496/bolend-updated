import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/http.service';

@Component({
	selector: 'app-notifications',
	templateUrl: './notifications.component.html',
	styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

	constructor (
		protected router: Router,
		protected http: HttpService
	) { }


	ngOnInit() {
		this.getNotifications();
	}


	notifications: object;
	get n() { return this.notifications; }		// n is shorthand for notifications

	/**
	 * Get currently auth'd user's notifications
	 */
	protected getNotifications () : void {
		let path: string = '/notifications';
		this.http.getObservable ( path ).subscribe (
			data => this.parseNotifications(data),
			err => this.http.genericModelErrorHandler(err)
		)
	}

	/**
	 * Parse notifications data returned by getNotifications()
	 * @param data data object returned; may be JSON
	 */
	parseNotifications ( data: object ) {
		console.log ( 'notifications', data );
		this.notifications = data;
	}
}
