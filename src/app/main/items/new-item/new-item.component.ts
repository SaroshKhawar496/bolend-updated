import { Component, OnInit } from '@angular/core';
import { HttpService, Model } from 'src/app/http.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Item, User } from 'src/app/_models/models';
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
	itemForm: 		FormGroup;
	currentUser: 	User;
	get f() { return this.itemForm.controls; }
	imgSrc: 		string | ArrayBuffer;
	submitted: 		boolean = false;
	editItem: 		boolean = false;
	itemCardOptions:ItemCardOptions = new ItemCardOptions (
		{
			colorWhite: true,
			hideDescription: false,
			// hideOwner: true
		}
	);

	constructor (
		protected http: HttpService,
		protected router: Router,
		public route: ActivatedRoute,
		protected formBuilder: FormBuilder,
		protected alert: AlertService,
	) { }


	ngOnInit() {
		this.initializeForm();
		this.currentUser = this.http.getCurrentUser();
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


	/** Process an image file input; allow a preview of the image and attach it to payload */
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
		let itemObj: object = Object.assign( {base64: this.imgSrc}, this.itemForm.value );
		let payload: object = {
			// item: this.itemForm.value
			item: itemObj,
		};
		this.submitted = true;

		// send the request
		this.alert.info ( "Submitting new item..." );
		this.http.postObservable ( path, payload ).subscribe (
			res => {
				console.log ( res );
				this.alert.success ( "Your new item has been uploaded and is available for request!", true );
				this.redirectOnSuccess ( res['id'].toString() );
			},
			(err: HttpErrorResponse) => this.http.genericModelErrorHandler(err, Model.Item)
		)
	}

	/**
	 * Redirect user to page showing details of their item on success
	 */
	redirectOnSuccess ( id: string ) : void {
		let path: Array<string> = [ '/item', id ];
		this.router.navigate ( path );
	}

}
