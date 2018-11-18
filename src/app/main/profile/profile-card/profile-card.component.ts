import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models/models';
import { HttpService } from 'src/app/http.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-profile-card',
	templateUrl: './profile-card.component.html',
	styleUrls: ['./profile-card.component.css']
})
export class ProfileCardComponent implements OnInit {
	@Input() user: User;
	@Input() cardOptions?: ProfileCardOptions;

	get u() { return this.user; }
	get opts() { return this.cardOptions; }


	constructor (
		protected http: HttpService,
		protected router: Router,
	) { }

	ngOnInit() {
	}

}


/**
 * Definition of accepted options for ProfileCardComponent
 */
export interface ProfileCardOptions {
	
}