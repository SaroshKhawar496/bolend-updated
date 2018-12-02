import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService, Model } from 'src/app/http.service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/_models/models';


@Component({
	selector: 'app-friends',
	templateUrl: './friends.component.html',
	styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit, OnDestroy {

	get catLut() { return FriendTabs; }			// return SocialCategory look up table
	get catKeys(): Array<string> { return Object.keys(FriendTabs); }	// get all categories in SocialCategory

	constructor (
		protected route: ActivatedRoute,
		protected http: HttpService,
		protected router: Router,
	) { }

	category: string;
	paramSub: Subscription;
	ngOnInit() {
		// subscribe to changes in the category parameter
		this.paramSub = this.route.params.subscribe(
			param => {
				this.category = param['cat'];
				this.getFriendIndex(this.category);
			}
		)
	}

	users: Array<User>;
	userControls: Array<FriendControls>;
	/**
	 * Get a list of friends, requests, friends-of-friends
	 * @param cat 
	 */
	getFriendIndex ( cat: string ) : void {
		let apiRoute: string = FriendTabs[cat].apiRoute;	// get the api route segment corresponding to this category
		let path: string = `/friends/${apiRoute}`;
		this.http.getObservable(path).subscribe(
			data => {
				console.log ( 'all my "friends"', data );
				if ( data ) {
					let userList = data['users'];
					this.users = data['users'].map( user => {// for each user in the friend array of the response:
						return new User(user);
					});
				} else 
					this.users = [];

				// set the available controls for each user
				this.userControls = FriendTabs[cat].controls;
			},
			err => this.http.genericModelErrorHandler(err, Model.User)
		)
	}


	/**
	 * Switch to the specified tab by changing the `cat` parameter in the URL
	 * @param cat specified category/tab route
	 */
	changeTab ( cat: string ) : void {
		this.router.navigate([`../${cat}`], {relativeTo: this.route});
	}


	/** Delete the user object at the index specified */
	hideIndex ( i: number ) : void {
		this.users.splice(i,1);
	}


	ngOnDestroy() {
		this.paramSub.unsubscribe();
	}

}

interface FriendTab {
	title: string,
	apiRoute: string,
	controls: FriendControls[],
}

/** the following controls should appear on each profile card, if the tab specified is selected  */
export enum FriendControls {
	profile = 0,	// navigate to their public profile
	block = 69,		// block user
	accept = 11,	// accept request
	deny = 12,		// deny request
	// delete,			// delete friend
	// deleteRequest,	// delete outgoing friend request
	request = 10,	// send user a friend request
	hide = 99,		// hide user, i.e. prevent them from showing up in results
	message = 98,	// private message
}
export const FriendTabs: {
	friends: FriendTab,
	incoming: FriendTab,
	outgoing: FriendTab,
	discover: FriendTab,
} = {
	friends: {
		title: 'Friends', 
		apiRoute: 'index',
		controls: [ FriendControls.profile, FriendControls.block ]
		// controls: [ FriendControls.delete, FriendControls.block ]
	},
	incoming: {
		title: 'Requests Received', 
		apiRoute: 'requested',
		controls: [ FriendControls.accept, FriendControls.deny, FriendControls.block ]
	},
	outgoing: {
		title: 'Requests Sent', 
		apiRoute: 'get-pending',
		controls: [ FriendControls.profile, FriendControls.block ]
	},
	discover: { 
		title: 'Make Friends', 
		apiRoute: 'mutual',
		controls: [ FriendControls.request, FriendControls.hide ]
	},
}
