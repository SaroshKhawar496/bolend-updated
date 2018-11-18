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
				// console.log ( this.category );
				this.getFriendIndex(this.category);
			}
		)
	}

	friends: Array<User>;
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
				let userList = data['users'];
				if ( userList )
					this.friends = data['users'].map( user => {// for each user in the friend array of the response:
						return new User(user);
					});
				else this.friends = [];
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


	ngOnDestroy() {
		this.paramSub.unsubscribe();
	}

}

interface FriendTab {
	title: string,
	apiRoute: string,
}
export const FriendTabs: object = {
	friends: 		{ title: 'Friends', apiRoute: 'index' } ,
	incoming:		{ title: 'Requests Received', apiRoute: 'get-pending' },
	outgoing:		{ title: 'Requests Sent', apiRoute: 'requested' },
	mutual_friends:	{ title: 'Mutual Friends', apiRoute: 'mutual' },
	// strangers:		{ title: 'Internet Strangers', apiRoute: null },
}
