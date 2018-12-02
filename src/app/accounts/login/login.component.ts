import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AlertService } from 'src/app/utils/alert/alert.service';

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
		public router: Router,
		public route: ActivatedRoute,
		public http: HttpService,
		public alert: AlertService
	) {}
	
	ngOnInit() {
		this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
		this.protocolCheck();
	}

	/**
	 * A password is submitted thru this page, check HTTPS status
	 */
	protocolCheck () : void {
		// determine whether the page is accessed using a secure protocol
		this.secureProtocol = location.protocol.startsWith('https');
		if ( !this.secureProtocol && environment.production )
			this.alert.warning ( HttpService.unsecureProtocolAlert );
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
		this.alert.info ( "Authenticating..." );
		let user = this.http.authenticate ( this.username, this.password, this.returnUrl, true );
	}

	public routerNav ( path: string ) : void {
		this.router.navigateByUrl ( path );
	}

}
