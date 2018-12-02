import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-not-found',
	templateUrl: './not-found.component.html',
	styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

	constructor() { }

	path: string;
	ngOnInit() {
		// random number 0-9
		let randDigit: number = Math.floor(Math.random() * 10);
		this.path = `assets/pepes/${randDigit}.png`;
	}

}
