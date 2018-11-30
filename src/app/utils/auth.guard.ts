import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { User } from '../_models/models';

@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanActivate {
	constructor ( 
		private router: Router,
		private http: HttpService,
	) {}

	async canActivate ( 
		next: ActivatedRouteSnapshot, 
		state: RouterStateSnapshot
	){//}: //Observable<boolean> | Promise<boolean> | boolean {

		// check if http.currentUser has an id & JWT; if it does, that means http.authenticate() has already been called
		let user: User = this.http.getCurrentUser();
		if ( user.id )
			return true;		// so we can safely return true
		

		// otherwise, try to get a JWT out of localstorage and ask HttpService to check that token
		let currentUserJWT = localStorage.getItem('currentUser');
		if ( currentUserJWT ) {
			// check if the token is valid and not expired
			let result = await this.http.checkToken ( currentUserJWT );

			// if result is OK, return true; otherwise, redirect to login page
			if ( result )
				return true;
			else
				console.log ( 'token validation failed! redirecting to login page');
		} else 
			console.log ( 'no JWT available. Redirecting to login page' );

		// not logged in so redirect to login page with the return url
		this.router.navigate(['/accounts/login'], { queryParams: { returnUrl: state.url }});
		return false;
	}
}
