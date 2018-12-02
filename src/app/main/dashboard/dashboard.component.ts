import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
import { User } from '../../_models/models';
import { Notification } from '../notifications/notification-card/notification-card.component';


@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

	itemList: any;
	currentUser: User;
	notifications: Notification[];

	constructor (
		private http: HttpService
	) { }

	ngOnInit() {
		this.loadCurrentUser();
	}

	loadCurrentUser () : void {
		this.currentUser = this.http.getCurrentUser();
	}

	loadNotifications() : void {
		let path: string = "/notifications";
		this.http.getObservable(path).subscribe(
			res => this.notifications = res['user_notification'].map(
				notif => new Notification(notif)
			),
			err => this.http.genericModelErrorHandler(err),
		)
	}

}
