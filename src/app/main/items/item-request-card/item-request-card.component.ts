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
	@Input() incoming: number;
	// @Output() accepted: EventEmitter<number> = new EventEmitter<number>();
	// @Output() declined: EventEmitter<number> = new EventEmitter<number>();
	@Output() remove: EventEmitter<boolean> = new EventEmitter<boolean>();

	// accept () { this.accepted.emit(+this.request.id); }	// even more dirty javascript hacks
	// decline() { this.declined.emit(+this.request.id); }
	get req(): ItemRequest { return this.request; }		// shorthand

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


	/**
	 * Accept an incoming item request with the specified request id
	 * @param id request id; NOT the item id
	 */
	acceptRequest ( id: number | string ) : void {
		this.rs.acceptItemRequest (id).subscribe(
			res => {
				this.alert.success('Request accepted! Item is loaned out!');
				// 'navigate' to add queryparam 'loaned=1'
				let extras: NavigationExtras = {
					queryParams: { loaned: 1 }
				}
				this.router.navigate ([], extras );
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
				this.remove.emit(true);
			},
			err => this.http.genericModelErrorHandler(err),
		)
	}

}
