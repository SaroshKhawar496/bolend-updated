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
		this.getItemsList();
	}

	loadCurrentUser () : void {
		this.currentUser = this.http.getCurrentUser();
	}

	getItemsList () : void {
		let path: string = '/items.json';
		this.http.getObservable (path).subscribe (
			data => {
				this.itemList = data;
				console.log ('getItemsList', data);
			}
		)
	}

}
