import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

	name: string;
	itemList: any;


	constructor (
		private http: HttpService
	) { }

	ngOnInit() {
		this.name = 'anon';
		this.getItemsList();
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
