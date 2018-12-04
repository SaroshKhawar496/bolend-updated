import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ItemRequest } from 'src/app/_models/models';
import { Router, NavigationExtras } from '@angular/router';
import { RequestService } from '../request.service';
import { AlertService } from 'src/app/utils/alert/alert.service';
import { HttpService } from 'src/app/http.service';



@Component({
	selector: 'app-item-request-card',
	templateUrl: './item-request-card.component.html',
	styleUrls: ['./item-request-card.component.css']
})
export class ItemRequestCardComponent implements OnInit {
	@Input() request: ItemRequest;
	@Input() cardOptions?: ItemRequestCardOptions = {};
	// @Input() incoming: number;
	// @Output() accepted: EventEmitter<number> = new EventEmitter<number>();
	// @Output() declined: EventEmitter<number> = new EventEmitter<number>();
	@Output() remove: EventEmitter<boolean> = new EventEmitter<boolean>();

	// getters (and abbreviations)
	get req(): ItemRequest { return this.request; }		// shorthand
	get opt() { return this.cardOptions; }

	constructor (
		protected router: Router,
		protected rs: RequestService,
		protected alert: AlertService,
		protected http: HttpService,
	) { }

	ngOnInit() {
	}

	/** Navigate to public profile of requesting specified user */
	navigateToUser ( id: string | number ) : void {
		let path: string[] = [ '/user', id + '' ];		// i love dirty javascript hacks
		this.router.navigate ( path );
	}

	/** Navigate to the page of the item being requested */
	navigateToItem( id: string | number ) : void {
		let path: string[] = [ '/item', id + '' ];
		this.router.navigate ( path );
	}

	/**
	 * Accept an incoming item request with the specified request id
	 * @param id request id; NOT the item id
	 */
	acceptRequest ( id: number | string, req: ItemRequest ) : void {
		this.rs.acceptItemRequest (id).subscribe(
			res => {
				this.alert.success('Request accepted! Item is loaned out!');
				// 'navigate' to add queryparam 'loaned=1'
				let extras: NavigationExtras = {
					queryParams: { loaned: 1, userId: req.requesting_user.id }
				}
				this.router.navigate ([], extras );
				this.remove.emit(true);
			},
			err => this.http.genericModelErrorHandler(err)
		)
	}


	/**
	 * Decline an incoming item request with the specified request id
	 * @param id request id
	 * @param index 
	 */
	declineRequest ( id: number | string ) : void {
		this.rs.declineItemRequest(id).subscribe (
			res => {
				this.alert.success ('Request successfully declined.' );

				// remove the request from item.requests array
				this.remove.emit(false);
			},
			err => this.http.genericModelErrorHandler(err),
		)
	}


	/**
	 * Delete the outgoing item request with the specified request id
	 * @param id request id
	 */
	deleteRequest ( id: number | string ) : void {
		this.rs.deleteItemRequest (id).subscribe(
			res => {
				this.alert.success ( 'Request successfully deleted.' );
				this.remove.emit(true);	// prompt parent to remove this request from view
			},
			err => this.http.genericModelErrorHandler(err),
		)
	}

}


export interface ItemRequestCardOptions {
	// the options in this interface are optional; they need not all be specified
	// remember that any unspecified property is undefined, and undefined is FALSY
	// i.e. any omitted property is undefined and false by default

	// is this card showing an outgoing request? If false, assume it is incoming
	outgoing?:	boolean,		

	// should this card contain a link to the item? If false, do not include link
	link?: boolean,
}