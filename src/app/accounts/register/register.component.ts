import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


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
		private router: Router
	) { }

	get f() { return this.regForm.controls; }

	ngOnInit() {
		this.initializeForm();
	}

	/**
	 * Create the form and specify validation parameters
	 */
	initializeForm () : void {
		this.regForm = this.formBuilder.group ({
			fname: [ '', Validators.required ],
			lname: [ '', Validators.required ],
			email: [ '', Validators.required ],
			password: [ '', Validators.required ],
			dob: [ '', Validators.required ]
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


	}
}
