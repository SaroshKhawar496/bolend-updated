import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ExtensibleModel, User } from 'src/app/_models/models';

@Component({
	selector: 'app-notification-card',
	templateUrl: './notification-card.component.html',
	styleUrls: ['./notification-card.component.css']
})
export class NotificationCardComponent implements OnInit {
	@Input() notification: Notification;
	@Input() cardOptions?: NotificationCardOptions;
	type: typeof NotificationType = NotificationType;

	// getter shortcuts
	get n(): Notification { return this.notification; }
	get opts(): NotificationCardOptions { return this.cardOptions; }


	constructor (
		protected router: Router,
	) { }

	ngOnInit() {
	}

	protected navigateToLink ( type: NotificationType, nObj: object ) : void {
		let path: Array<string|number>;
		switch ( type ) {
			case NotificationType.item_request: path = [ '/item', nObj['item_id'] ];
				break;
			default: path = [];
		}
		this.router.navigate ( path );
	}

	/**
	 * Navigate to the public profile page of the sender of the notification
	 */
	protected navigateToSender () : void {
		let path: Array<string|number> = ['/user', this.n.Sender.id];
		this.router.navigate(path);
	}

}


export enum NotificationType {
	Generic = 0,
	item_request,
	friend_request,
	borrow_accept,
	friend_accept,
}

export interface NotificationCardOptions {

}


export class Notification extends ExtensibleModel {
	recipient_id:	number;
	sender:			object;
	action:			string;
	link_to:		number;

	read_at:		any;
	created_at:		any;

	// parsed properties
	Type:			NotificationType;
	Sender:			User;


	constructor ( attribs?: object ) {
		super ( attribs );
		this.parseProperties();
	}

	/**
	 * Parse the properties received into typed properties used by the card
	 */
	parseProperties () : number {
		let count: number = 0;

		// parse NotificationType using the action property, if it exists
		if ( this.action ) {
			this.Type = NotificationType[this.action];
			if ( this.Type ) count++;
		}

		// parse sender user
		if ( this.sender ) {
			this.Sender = new User (this.sender);
		}

		// parse datetime created and datetime read, if they exist
		// if ( this.created_at ) 
		// 	this.dtCreated = new Date ( this.created_at );
		// if ( this.read_at )
		// 	this.dtRead = new Date ( this.read_at );
		

		return count;
	}


	// getter methods
}