import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
import { User } from '../../_models/models';


@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

	itemList: any;
	currentUser: User;

	constructor (
		private http: HttpService
	) { }

	ngOnInit() {
		this.loadCurrentUser();
	}

	loadCurrentUser () : void {
		this.currentUser = this.http.getCurrentUser();
	}

}
