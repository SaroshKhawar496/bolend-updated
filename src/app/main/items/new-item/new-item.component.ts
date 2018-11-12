import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Item } from 'src/app/_models/item';
import { HttpErrorResponse } from '@angular/common/http';
import { ItemCardOptions } from '../item-card/item-card.component';
import { AlertService } from 'src/app/utils/alert/alert.service';


@Component({
	selector: 'app-new-item',
	templateUrl: './new-item.component.html',
	styleUrls: ['./new-item.component.css', '../item-card/item-card.component.css',]
})
export class NewItemComponent implements OnInit {

	// member properties
	itemForm: FormGroup;
	get f() { return this.itemForm.controls; }
	imgSrc: string | ArrayBuffer;
	// item: Item = new Item();
	submitted: boolean = false;
	itemCardOptions: ItemCardOptions = new ItemCardOptions ({colorWhite: true});

	constructor (
		protected http: HttpService,
		protected router: Router,
		protected formBuilder: FormBuilder,
		protected alert: AlertService,
		// protected file: File,
		// protected fReader: FileReader,
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


	processFile ( input: any ) : void {
		console.log ( 'processFile', input);
		const file: File = input.files[0];
		const reader: FileReader = new FileReader();
		if (file){
			console.log ( 'file', file );
			reader.onload = (e: any) => {
				console.log ('onload', e);
				this.imgSrc = e.target.result;
			}
			reader.readAsDataURL(file);
		}
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
		this.alert.info ( "Submitting new item..." );
		this.http.postObservable ( path, payload ).subscribe (
			res => {
				console.log ( res );
				this.alert.success ( "Your new item has been uploaded and is available for request!", true );
			},
			(err: HttpErrorResponse) => console.error ( err )
		)
	}

}
