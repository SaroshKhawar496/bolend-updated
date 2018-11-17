import { Component, OnInit, Input } from '@angular/core';
// import { HttpService } from 'src/app/http.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-notification-card',
	templateUrl: './notification-card.component.html',
	styleUrls: ['./notification-card.component.css']
})
export class NotificationCardComponent implements OnInit {
	@Input() notification: Notification;
	get n(): Notification { return this.notification; }

	constructor (
		protected router: Router,
	) { }

	ngOnInit() {
	}


	protected navigateToLink ( id?: number ) : void {
		let path: string = '';
	}

}


export enum NotificationType {
	Generic = 0,
	borrow_request,
	friend_request,
	borrow_accept,
	friend_accept,
}

export interface NotificationCardOptions {

}


export interface Notification {
	recipient_id:	number,
	sender_id:		number,
	action:			string,
	link_to:		number,

	read_at?: any,
}