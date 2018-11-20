import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models/models';
import { HttpService } from 'src/app/http.service';
import { Router } from '@angular/router';
import { FriendControls } from '../../social/friends/friends.component';

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
	) { }

	ngOnInit() {
	}


	/** Navigate to the public profile of this user */
	navigateToUser () : void {
		let path: string = `/user/${this.user.id}`;
		this.router.navigate([path]);
	}

}


/**
 * Definition of accepted options for ProfileCardComponent
 */
export interface ProfileCardOptions {
	message: string,
	controls: FriendControls,
}