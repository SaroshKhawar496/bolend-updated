import { Component } from '@angular/core';
import { ProfileComponent } from '../profile/profile.component';
import { User, ItemRequest } from 'src/app/_models/models';
import { Model } from 'src/app/http.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ItemCardOptions } from '../items/item-card/item-card.component';
import { ItemRequestCardOptions } from '../items/item-request-card/item-request-card.component';

@Component({
	selector: 'app-you',
	templateUrl: '../profile/profile.component.html',
	styleUrls: ['../profile/profile.component.css']
})
export class YouComponent extends ProfileComponent {
	incomingRequests: ItemRequest[];
	incomingCardOptions: ItemRequestCardOptions;
	outgoingRequests: ItemRequest[];
	outgoingCardOptions: ItemRequestCardOptions;
	get in () { return this.incomingRequests; }
	get out() { return this.outgoingRequests; }
	get inOpts() { return this.incomingCardOptions; }
	get outOpts(){ return this.outgoingCardOptions; }

	// incoming & outgoing item-card options
	inCardOptions: ItemCardOptions = new ItemCardOptions({
		inRequest: true,
		hideOwner: true,
	})


	ngOnInit() {
		// load default, empty user
		this.you = true;
		this.currentUser = new User;

		this.loadYou();
		this.loadRequests();

		this.incomingCardOptions = {
			link: true,
			outgoing: false,
		}
		this.outgoingCardOptions = {
			link: true,
			outgoing: true,
		}
	}

	/**
	 * Load your own user model
	 */
	private loadYou () : void {
		let path: string = '/users/you';
		this.http.getObservable ( path ).subscribe (
			data => this.loadUserDataHandler(data),
			(err: HttpErrorResponse) => this.http.genericModelErrorHandler(err, Model.User),
		)
	}


	loadUserDataHandler ( data: object ) : object {
		console.log ( 'you.loadUserDataHandler', data );
		super.loadUserDataHandler(data);
		this.you = true;
		return this.currentUser;
	}


	/** Load your item requests */
	private loadRequests () : void {
		let path: string = '/requests';
		this.http.getObservable (path).subscribe(
			data => {
				this.incomingRequests = this.requestsDataHandler ( data['incoming_requests'] );
				this.outgoingRequests = this.requestsDataHandler ( data['outgoing_requests'] );
				console.log ( 'loadRequests', this.incomingRequests, this.outgoingRequests );
			}
		)
	}


	/** Hide a deleted outgoing request by removing it from the outgoingRequests array */
	private removeOutgoingRequest (index: number) {
		this.outgoingRequests.splice(index,1);
	}


	private requestsDataHandler ( data: object[] ) : ItemRequest[] {
		return data.map ( req => new ItemRequest(req) );
	}


	/** 
	 * Set the privacy setting of your profile
	 * @param setPrivate true = make profile private
	 */
	setProfilePrivacy ( setPrivate: boolean ) {
		let path: string = `/users/private-mode-${setPrivate}`;
		this.http.putObservable ( path, null ).subscribe (
			res => {
				console.log ( "Successfully changed profile permissions." );
				this.alert.success ( "Successfully changed your profile's permissions." );
				this.loadYou();
			},
			err => this.http.genericModelErrorHandler(err),
		)
	}


	
}
