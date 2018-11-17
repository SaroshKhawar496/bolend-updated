import { Component } from '@angular/core';
import { ProfileComponent } from '../profile/profile.component';
import { User } from 'src/app/_models/models';
import { Model } from 'src/app/http.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ItemCardOptions } from '../items/item-card/item-card.component';

@Component({
	selector: 'app-you',
	templateUrl: '../profile/profile.component.html',
	styleUrls: ['../profile/profile.component.css']
})
export class YouComponent extends ProfileComponent {
	incomingRequests: object;
	outgoingRequests: object;
	get in () { return this.incomingRequests; }
	get out() { return this.outgoingRequests; }

	// incoming & outgoing item-card options
	inCardOptions: ItemCardOptions = new ItemCardOptions({
		inRequest: true,
		hideOwner: true,
	})


	ngOnInit() {
		// load default, empty user
		this.currentUser = this.http.getCurrentUser();

		this.loadYou();
		this.loadRequests();
	}

	/**
	 * Load your own user model
	 */
	private loadYou () : void {
		let path: string = '/users/you';
		this.http.getObservable ( path ).subscribe (
			data => {
				console.log ( 'loadYou', data );
				this.currentUser = new User(data);
				this.you = true;
			},
			(err: HttpErrorResponse) => this.http.genericModelErrorHandler(err, Model.User),
		)
	}

	/**
	 * Load your requests
	 */
	private loadRequests () : void {
		let path: string = '/requests';
		this.http.getObservable (path).subscribe(
			data => {
				this.incomingRequests = data['incoming_requests'];
				this.outgoingRequests = data['outgoing_requests'];
				console.log ( 'loadRequests', this.incomingRequests, this.outgoingRequests );
			}
		)
	}

}
