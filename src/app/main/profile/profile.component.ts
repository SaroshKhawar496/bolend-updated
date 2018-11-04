import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpService } from '../../http.service';
import { User } from '../../_models/user';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
// import { Observable } from 'rxjs';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

	currentUser: User;
	paramSub: any;

	constructor ( 
		private http: HttpService,
		private route: ActivatedRoute,
		private router: Router,
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
				this.currentUser = Object.assign ( this.currentUser, data );
			},
			(err: HttpErrorResponse) => this.loadUserErrorHandler(err),
		)
	}


	// 401 errors (invalid/expired JWT) will have been intercepted before this
	// we should only be dealing with 404 or 5xx here
	loadUserErrorHandler ( err: HttpErrorResponse ) : void {
		// user not found
		if ( err.status == 404 ) {
			
		}
	}

	ngOnDestroy(): void {
		this.paramSub.unsubscribe();
	}
}
