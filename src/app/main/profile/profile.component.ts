import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpService } from '../../http.service';
import { User } from '../../_models/user';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Consts } from '../../_models/consts';
import { AlertService } from 'src/app/utils/alert/alert.service';
import { Subscription } from 'rxjs';
// import { Observable } from 'rxjs';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

	currentUser: User;
	paramSub: Subscription;
	defaultMaxAvailableItems:	number = 3;
	defaultMaxBorrowedItems:	number = 3;


	constructor ( 
		private http: HttpService,
		private route: ActivatedRoute,
		private router: Router,
		private alert: AlertService,
	) { }


	ngOnInit () {
		this.currentUser = this.http.getCurrentUser();

		// subscribe to changes in url params
		this.paramSub = this.route.params.subscribe (
			params => {			// this function is called when route param changes
				this.loadUser ( +params.id );		// convert id to number, using javascript bullshit magic
			}
		);

	}

	loadUser ( id?: number ) : void {
		// this.currentUser = this.http.getCurrentUser();
		let path: string = `/users/${id}`;
		this.http.getObservable ( path ).subscribe(
			data => {
				console.log ( 'loadUser', data );
				this.currentUser = new User(data);
			},
			(err: HttpErrorResponse) => this.loadUserErrorHandler(err),
		)
	}

	// 401 errors (invalid/expired JWT) will have been intercepted before this
	// we should only be dealing with 404 or 5xx here
	loadUserErrorHandler ( err: HttpErrorResponse ) : void {
		// user not found
		if ( err.status == 404 ) {
			console.error ( "No user with this ID exists!" );
			this.alert.error ( "No user with this ID exists!" );
		} else if ( err.status >= 500 ) {
			console.error ( Consts.serverFaultMsg );
			this.alert.error ( Consts.serverFaultMsg );
		} 
	}


	get u() { return this.currentUser; }

	ngOnDestroy(): void {
		if ( this.paramSub )
			this.paramSub.unsubscribe();
	}
}
