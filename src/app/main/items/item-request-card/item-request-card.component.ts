import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ItemRequest } from 'src/app/_models/models';
import { Router } from '@angular/router';



@Component({
	selector: 'app-item-request-card',
	templateUrl: './item-request-card.component.html',
	styleUrls: ['./item-request-card.component.css']
})
export class ItemRequestCardComponent implements OnInit {
	@Input() request: ItemRequest;
	@Output() accepted: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() declined: EventEmitter<boolean> = new EventEmitter<boolean>();

	accept () { this.accepted.emit(true); }
	decline() { this.declined.emit(true); }
	get req(): ItemRequest { return this.request; }		// shorthand

	constructor (
		protected router: Router,
	) { }

	ngOnInit() {

	}

	/** Navigate to public profile of requesting specified user */
	navigateToUser ( id: string | number ) : void {
		let path: string[] = [ '/user', id + '' ];		// i love dirty javascript hacks
		this.router.navigate ( path );
	}


}
