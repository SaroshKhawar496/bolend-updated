import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanActivate {
	constructor ( private router: Router ) {}

	canActivate ( 
		next: ActivatedRouteSnapshot, 
		state: RouterStateSnapshot
	): Observable<boolean> | Promise<boolean> | boolean {
		
		// check if the user is logged in
		let currentUserJWT = localStorage.getItem('currentUser');
		if ( currentUserJWT ) {
			// logged in so return true
			console.log ( "User logged in. JWT:", currentUserJWT );
			return true;
		}

		// not logged in so redirect to login page with the return url
		this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
		return false;
	}
}
