import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AlertService } from '../../utils/alert/alert.service';


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
		this.http.postObservable ( registerPath, payload ).subscribe(
			data => {
				console.log ( 'Registration successful', data );
				this.router.navigateByUrl ('');		// redirect to home page (which may then redirect to login)
				this.alert.success ( "Yay!!" );
			},
			err => {
				console.error ( err );
				this.alert.error ( err );
			}
		)

	}
}
