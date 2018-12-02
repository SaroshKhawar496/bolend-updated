import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/http.service';
import { Notification,NotificationType } from './notification-card/notification-card.component';
import { Pagination } from 'src/app/utils/app-utils';
import { HttpHeaders } from '@angular/common/http';
import { AlertService } from 'src/app/utils/alert/alert.service';

@Component({
	selector: 'app-notifications',
	templateUrl: './notifications.component.html',
	styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

	constructor (
		protected router: Router,
		protected http: HttpService,
		protected alert: AlertService,
	) { }

	NotificationType: typeof NotificationType = NotificationType;

	ngOnInit() {
		this.getNotifications();
	}


	get n() { return this.notifications; }
	notifications: Array<Notification>;
	pagination: Pagination;
	path: string = '/notifications';


	/**
	 * Get currently auth'd user's notifications
	 */
	protected getNotifications () : void {
		this.http.getObservable ( this.path ).subscribe (
			data => this.parseNotifications(data),
			err => this.http.genericModelErrorHandler(err)
		)
	}


	/**
	 * Parse notifications data returned by getNotifications()
	 * @param data data object returned; may be JSON
	 */
	protected parseNotifications ( data: object, append: boolean = false ) {
		// console.log ( 'notifications', data );
		let notifObject: object = data;

		// parse user_notifcations
		if ( !append ){
			this.notifications = notifObject['user_notifications'].map (
				notif => new Notification(notif)
			)
		} else {
			this.notifications = this.notifications.concat ( 
				notifObject['user_notifications'].map (
					notif => new Notification(notif)
				)
			 )
		}

		// save pagination info if it is available
		if ( data['pages'] )
			this.pagination = data['pages'];

		console.log ( 'parsed notifications:', this.notifications, this.pagination );
	}


	/** Load the next page of notifications */
	protected loadNextPage () {
		// increment page number
		this.pagination.page++;
		if ( this.pagination.page >= this.pagination.total_pages ){
			this.alert.info ( "You've reached the end of notifications. And the end of the line." );
			return;
		}

		let headers: HttpHeaders = new HttpHeaders ({
			'page': this.pagination.page.toString(),
			'perpage': this.pagination.perpage.toString() || null,
		})
		this.http.getObservable ( this.path ).subscribe (
			data => this.parseNotifications(data, true),
			err => this.http.genericModelErrorHandler(err),
		)
	}
}
