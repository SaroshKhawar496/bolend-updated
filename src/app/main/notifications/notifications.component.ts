import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/http.service';
import { Notification,NotificationType } from './notification-card/notification-card.component';

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

	NotificationType: typeof NotificationType = NotificationType;

	ngOnInit() {
		this.getNotifications();
	}


	get n() { return this.notifications; }
	notifications: Array<Notification>;


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
	protected parseNotifications ( data: object ) {
		// console.log ( 'notifications', data );
		let notifObject: object = data;

		// parse user_notifcations
		this.notifications = notifObject['user_notifications'].map (
			notif => new Notification(notif)
		)
		console.log ( 'parsed notifications:', this.notifications );
	}
}
