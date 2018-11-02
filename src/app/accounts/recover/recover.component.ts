import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-recover',
	templateUrl: './recover.component.html',
	styleUrls: ['./recover.component.css', '../login/login.component.css']
})
export class RecoverComponent implements OnInit {

	username: string;

	constructor() { }

	ngOnInit() {
	}

}
