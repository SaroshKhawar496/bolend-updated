import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AlertService } from '../../utils/alert/alert.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';


@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: [ '../accounts.component.css' ]
})
export class RegisterComponent implements OnInit {

	regForm: FormGroup;
	loading: boolean = false;
	submitted: boolean = false;


	constructor(
		private http: HttpService,
		private formBuilder: FormBuilder,
		private router: Router,
		private alert: AlertService
	) { }


	/**
	 * Get the form's controls
	 */
	get f() { return this.regForm.controls; }

	ngOnInit() {
		this.initializeForm();
	}

	/**
	 * Create the form and specify validation parameters
	 */
	initializeForm () : void {
		this.regForm = this.formBuilder.group ({
			fname: new FormControl ( null, [Validators.required, Validators.minLength(2) ]),
			lname: new FormControl ( null, [Validators.required, Validators.minLength(2) ]),
			email: new FormControl ( null, [Validators.required, Validators.email ] ),
			password: new FormControl ( null, Validators.required ),
			dateofbirth: new FormControl ( null, Validators.required )
		});
	}

	/**
	 * Submit registration form to server.  
	 * Navigate to homepage/login if successful
	 * Display alert with error if unsuccessful
	 */
	submitRegistration () : void {
		this.submitted = true;

		// stop here if form is invalid
		if (this.regForm.invalid) {
			console.log ( 'submitRegistration: form is invalid!' );
			return;
		}

		this.loading = true;

		let registerPath: string = '/accounts'
		let payload: object = {
			user: this.regForm.value
		}
		let fname: string = this.regForm.value.fname;

		// include headers with the request. We will do our own error handling here
		this.http.postObservable ( registerPath, payload, true ).subscribe(
			res => {
				let response = <HttpResponse<object>> res;
				if ( response && response.ok ) {
					// if the HTTP response was OK (no errors), try to extract the JWT
					let extractRes = this.http.extractJWT ( <HttpResponse<object>> res );

					if ( extractRes ) {
						console.log ( 'Registration successful', response.body );
						this.alert.success ( `Thanks ${fname}! Your account was successfully created!`, true );
						this.router.navigateByUrl ('');		// redirect to login page
					} else {
						console.log ( 'Failed to extract JWT, although response was OK' );
						this.alert.error ( 'OOPSIE WOOPSIE!! Uwu We made a fucky wucky!! A wittle fucko boingo! The code monkeys at our headquarters are working VEWY HAWD to fix this!');
					}
				} else if (response) {
					console.log ( response );
				} else 
					console.log ( res );
			},
			(err: HttpErrorResponse) => {
				this.errorHandler ( err );
			}
		)

	}


	/**
	 * Handle registration errors
	 * @param response HttpErrorResponse object
	 */
	private errorHandler ( response: HttpErrorResponse ) : void {
		console.error ( 'errorHander', response );

		// "unprocessable entity"
		if ( response.status == 422 ) {
			let payload: object = response.error.errors;
			let alertMsgs: Array<string> = [];
			for ( var e in payload ) {
				let msg: string = `${e} ${payload[e].join(', ')}`;
				alertMsgs.push(msg);
			}
			console.log ( 'alerting:', alertMsgs.join('') );
			this.alert.error ( alertMsgs.join('. ') );
		}

	}

}
