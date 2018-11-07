import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Item } from 'src/app/_models/item';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
	selector: 'app-new-item',
	templateUrl: './new-item.component.html',
	styleUrls: ['./new-item.component.css', '../item-card/item-card.component.css',]
})
export class NewItemComponent implements OnInit {

	// member properties
	itemForm: FormGroup;
	get f() { return this.itemForm.controls; }
	item: Item = new Item();
	submitted: boolean = false;

	constructor (
		protected http: HttpService,
		protected router: Router,
		protected formBuilder: FormBuilder,
	) { }


	ngOnInit() {
		this.initializeForm();

	}

	/**
	 * Initialize the form used to create new items. Establish validation parameters
	 */
	initializeForm () : void {
		this.itemForm = this.formBuilder.group ({
			name: new FormControl ( null, [Validators.required] ),
			description: new FormControl ( null, [Validators.required] ),
			tags: new FormControl(),
		});
	}


	/**
	 * Send POST request to server to create new item
	 */
	submitItem () : void {
		let path: string = "/items";
		let payload: object = {
			item: this.itemForm.value
		};
		this.submitted = true;

		// send the request
		this.http.postObservable ( path, payload ).subscribe (
			res => {
				console.log ( res );
			},
			(err: HttpErrorResponse) => console.error ( err )
		)
	}

}
