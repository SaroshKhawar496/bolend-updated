import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['../accounts.component.css']
})
export class LoginComponent implements OnInit {

	secureProtocol: boolean;
	username: string;
	password: string;
	returnUrl: string;

	constructor (
		private router: Router,
		private route: ActivatedRoute,
		private http: HttpService,
	) {}
	
	ngOnInit() {
		this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

		// determine whether the page is accessed using a secure protocol
		this.secureProtocol = location.protocol.startsWith('https');
	}


	/**
	 * Authenticate the user
	 */
	public submitLogin () : void {
		// alert user if page NOT loaded using secure protocol, and we are in PRODUCTION mode
		if ( !this.secureProtocol && environment.production ){
			let confirm: boolean = window.confirm ( HttpService.unsecureProtocolAlert );

			// stop if user clicks cancel
			if ( !confirm )
				return;
		}

		// submit authentication request
		let user = this.http.authenticate ( this.username, this.password, this.returnUrl, true );
	}

	public routerNav ( path: string ) : void {
		this.router.navigateByUrl ( path );
	}

}
