import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-social',
	templateUrl: './social.component.html',
	styleUrls: ['./social.component.css']
})
export class SocialComponent implements OnInit {

	// constants
	maxStrangers:	number = 6;
	maxMutual:		number = 6;
	

	constructor() { }

	ngOnInit() {
	}

}
