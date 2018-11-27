import { Component, OnInit } from '@angular/core';


/**
 * This component will be rendered for an item that the currently auth'd user owns
 * and has incoming requests for.
 * 
 * This component will display show all a list of all users who have requested this item.
 * This component is meant to be a child of ItemDetailComponent
 */
@Component({
	selector: 'app-requested',
	templateUrl: './requested.component.html',
	styleUrls: ['../item-details/item-details.component.css']
})
export class RequestedComponent implements OnInit {

	constructor () { }

	ngOnInit () {
	}

}
