import { Component } from '@angular/core';
import { NewItemComponent } from './new-item.component';
import { Item } from 'src/app/_models/models';
import { Model } from 'src/app/http.service';
import { FormControl, Validators } from '@angular/forms';


@Component({
	selector: 'app-edit-item',
	templateUrl: './new-item.component.html',
	styleUrls: ['./new-item.component.css', '../item-card/item-card.component.css',]
})
export class EditItemComponent extends NewItemComponent {
	editItem: boolean = true;
	itemId: string;    // store as string instead of number, since this value is populated from the URL

	/** In addition to parent component's initialization, fetch the item's details  
	 * and load it into the form.
	 */
	ngOnInit () {
		this.currentUser = this.http.getCurrentUser();

		// initialize form after getting gettin item details
		this.itemId = this.route.snapshot.params['id'];
		this.getItemDetails(this.itemId);

	}

	/** Get the item details matching the id and load it into the form */
	getItemDetails ( id: string ) {
		let path: string = `/items/${id}`;
		this.http.getObservable(path).subscribe(
			data => this.initFormWithValues ( new Item(data) ),
			err => this.http.genericModelErrorHandler(err, Model.Item),
		)
	}

	/**
	 * Initialize form with initial item details
	 * @param item item object containing details
	 */
	initFormWithValues ( item: Item ) {
		console.log ( 'editing item:', item );
		this.itemForm = this.formBuilder.group ({
			name: new FormControl ( item.name, [Validators.required] ),
			description: new FormControl ( item.description, [Validators.required] ),
			tags: new FormControl(),
		});
	}

	/** Send an HTTP PUT request with the updated item details to the server */
	submitItem() {
		let path: string = `/items/${this.itemId}`;
		let itemObj: object = Object.assign( {image: this.imgSrc}, this.itemForm.value );
		let payload: object = { item: itemObj };
		this.http.putObservable(path, payload).subscribe(
			res => {
				this.alert.success ( "Item updated!", true );
				this.redirectOnSuccess ( this.itemId );
			},
			err => this.http.genericModelErrorHandler(err, Model.Item)
		)
	}
}