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
	@Input() owner?: object = { fullName: 'Anon' };
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
		if ( !this.owner ) return;
		let path: Array<string> = [ '/user', this.owner['id'].toString() ];
		this.router.navigate ( path );
	}

}


export class ItemCardOptions {
	colorWhite: boolean = false;


	constructor ( options?: object ) {
		if ( options ){
			for ( let p in options )
				this[p] = options[p];
		}
	}
}
