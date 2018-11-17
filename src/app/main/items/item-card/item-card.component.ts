import { Component, OnInit, Input } from '@angular/core';
import { Item, User } from 'src/app/_models/models';
import { Router } from '@angular/router';

@Component({
	selector: 'app-item-card',
	templateUrl: './item-card.component.html',
	styleUrls: ['./item-card.component.css']
})
export class ItemCardComponent implements OnInit {
	@Input() item: Item;
	@Input() owner?: object;
	@Input() cardOptions?: ItemCardOptions = new ItemCardOptions();

	constructor (
		protected router: Router,
	) { }

	ngOnInit() {

	}


	/**
	 * Navigate to item details for this particular item
	 */
	navigateToDetails() {
		let path: Array<string> = [ '/item', this.item.id.toString() ];
		this.router.navigate ( path );
	}

	/**
	 * navigate to profile page of the item owner; if item owner was not specified, do nothing
	 */
	navigateToOwner () {
		if ( !this.owner && !this.item.user.id ) return;
		console.log ( this.owner, this.item.user );
		let userId: string = (this.owner ? this.owner['id'] : this.item.user.id).toString();
		console.log ( 'navtoowner', userId);
		let path: Array<string> = [ '/user', userId ];
		this.router.navigate ( path );
	}

	/**
	 * Given an object containing the name of the user, 
	 * @param user 
	 */
	public getOwnerFullName (user: object){
		if ( !user || !('fname' in user) || !('lname' in user) )
			return null;
		else 
		return `${user['fname']} ${user['lname']}`;
	}


	/**
	 * Get the owner ID of this item, if possible
	 */
	public get ownerId () : number {
		if ( this.owner && this.owner['id'] ) 
			return this.owner['id'];
		else if ( this.item.user && this.item.user.id ) 
			return this.item.user.id;
		else return null;
	}
}


export class ItemCardOptions {
	colorWhite:		boolean = false;	// use white font and border, no background
	hideOwner:		boolean = false;	// hide the name of the item owner?
	inRequest:		boolean = false;	// is this item card used to show an incoming request?
	hideDescription:boolean = true;		// hide item description?
	hideTags:		boolean = true;		// hide tags?


	constructor ( options?: object ) {
		if ( options ){
			for ( let p in options )
				this[p] = options[p];
		}
	}
}