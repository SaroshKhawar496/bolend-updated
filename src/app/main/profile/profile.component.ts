import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpService, Model } from '../../http.service';
import { User } from '../../_models/models';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from 'src/app/utils/alert/alert.service';
import { Subscription } from 'rxjs';
import { timeDelta } from 'src/app/utils/app-utils';


@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

	currentUser: User;
	you: boolean = true;
	paramSub: Subscription;
	defaultMaxAvailableItems:	number = 666;
	defaultMaxBorrowedItems:	number = 666;


	constructor ( 
		protected http: HttpService,
		protected route: ActivatedRoute,
		protected router: Router,
		protected alert: AlertService,
	) { }


	ngOnInit () {
		// load a default, empty user
		this.currentUser = this.http.getCurrentUser();

		// subscribe to changes in url params
		this.paramSub = this.route.params.subscribe (
			params => {			// this function is called when route param changes
				this.loadUser ( +params.id );		// convert id to number, using javascript bullshit magic
			}
		);

	}

	/**
	 * Given an user id, request more info about that user from the server
	 * @param id user id
	 */
	loadUser ( id?: number ) : void {
		let path: string = `/users/${id}`;
		this.http.getObservable ( path ).subscribe(
			data => this.loadUserDataHandler(data),
			(err: HttpErrorResponse) => this.http.genericModelErrorHandler(err, Model.User)
		)
	}


	get user() { return this.currentUser; }
	memberSince: string;

	/** Data parser for request that loads user */
	loadUserDataHandler ( data: object ) : object {
		// create an instance of User and assign it to currentUser
		this.currentUser = new User(data);

		// determine if this user is you
		this.you = (this.currentUser.id == this.http.getCurrentUser().id);

		// determine the string for "Member since" status
		if ( this.currentUser.created_at )
			this.memberSince = timeDelta ( this.currentUser.created_at );
		console.log ( 'wtf', this.currentUser.created_at, this.memberSince );

		return this.currentUser;
	}

	ngOnDestroy(): void {
		if ( this.paramSub )
			this.paramSub.unsubscribe();
	}
}
