import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

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
	}


	/**
	 * Authenticate the user
	 */
	public submitLogin () : void {
		let user = this.http.authenticate ( this.username, this.password, this.returnUrl );
	}

	public routerNav ( path: string ) : void {
		this.router.navigateByUrl ( path );
	}

}
