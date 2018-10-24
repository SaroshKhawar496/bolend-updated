import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

	name: string;


	constructor (

	) { }

	ngOnInit() {
		this.name = 'anon';
	}

}
