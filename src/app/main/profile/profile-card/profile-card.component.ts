import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models/models';
import { HttpService } from 'src/app/http.service';
import { Router } from '@angular/router';
import { FriendControls } from '../../social/friends/friends.component';
import { AlertService } from 'src/app/utils/alert/alert.service';

@Component({
	selector: 'app-profile-card',
	templateUrl: './profile-card.component.html',
	styleUrls: ['./profile-card.component.css']
})
export class ProfileCardComponent implements OnInit {
	@Input() user: User;
	@Input() cardOptions?: ProfileCardOptions;
	@Input() userControls: Array<FriendControls>;

	get u() { return this.user; }
	get opts() { return this.cardOptions; }

	// misc class variables
	fallbackImgSrc: string = "assets/img/pepe.png";
	ctrls: typeof FriendControls = FriendControls;


	constructor (
		protected http: HttpService,
		protected router: Router,
		protected alert: AlertService,
	) { }

	ngOnInit() {
	}


	/** Navigate to the public profile of this user */
	navigateToUser () : void {
		let path: string = `/user/${this.user.id}`;
		this.router.navigate([path]);
	}

	/**
	 * Handle profile-card control clicked event
	 * @param type FriendControls enum
	 */
	processCtrl ( type: FriendControls ) : void {
		// do nothing if the type given is not a valid FriendControl
		if ( !(FriendControls[type]) ){
			console.error ( "Not a valid control on ProfileCardComponent!", type );
			return;
		}

		// act according to the type of control invoked
		let userId: number = this.user.id;
		switch ( type ) {

			// navigate to public profile
			case FriendControls.profile: 
				this.navigateToUser();
				break;
			
			// for block, accept, deny, and send request, send a POST request with user_id as payload
			case FriendControls.block:
			case FriendControls.accept:
			case FriendControls.deny:
			case FriendControls.request:
				this.friendPostRequest ( type, userId );
				break;

		}
	}

	/**
	 * Send a POST request for an action related to friendships
	 * @param type FriendControls enum; the type of action for this request
	 * @param userId user ID of user for which the action will be done to. Lol wtf is this sentence
	 */
	friendPostRequest ( type: FriendControls, userId: number ) : void {
		let path: string = `/friends/${FriendControls[type]}`;
		let payload: { user_id: number } = { user_id: userId };
		this.http.postObservable(path, payload).subscribe(
			data => {		// on success
				console.log ( 'friendPostRequest', data );
				this.alertUser ( type, true );
			},
			err => {
				// use a custom alert if 
				if (!this.http.genericModelErrorHandler(err))
					this.alertUser ( type, false );
			}
		);
	}


	/**
	 * Conditionally display an alert to the user, after a POST request for an action related to friends
	 * @param type FriendControls enum; describes the type of action this alert is for
	 * @param success true for success, false for failure
	 * @param message *optional*:
	 */
	alertUser ( type: FriendControls, success: boolean, message?: string ) {
		if ( success ) {
			let lut: object = {
				[FriendControls.block]: 	`You've successfully blocked ${this.user.fullName}.`,
				[FriendControls.accept]: 	`You've accepted ${this.user.fullName}'s friend request!`,
				[FriendControls.deny]:		`You've denied ${this.user.fullName}'s friend request.`,
				[FriendControls.request]:	`You've sent a friend request to ${this.user.fullName}`,
			}
			// display success message; use message if it was specified, otherwise look up in obj above
			this.alert.success ( message || lut[type] );
		} else {
			// let lut: object = {

			// }
			// display error message; use message if it was specified
			this.alert.error ( message || "Oops, something went wrong. Please try again later." );
		}
	}

}


/**
 * Definition of accepted options for ProfileCardComponent
 */
export interface ProfileCardOptions {
	message: string,
	controls: FriendControls,
}