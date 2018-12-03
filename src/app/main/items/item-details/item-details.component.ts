import { Component, OnInit } from '@angular/core';
import { HttpService, Model } from 'src/app/http.service';
import { AlertService } from 'src/app/utils/alert/alert.service';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import { Subscription } from 'rxjs';
import { Item, User, Loan } from 'src/app/_models/models';
import { HttpErrorResponse } from '@angular/common/http';
import { RequestService } from '../request.service';

@Component({
	selector: 'app-item-details',
	templateUrl: './item-details.component.html',
	styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit {

	constructor (
		protected http: HttpService,
		protected alert: AlertService,
		protected router: Router,
		protected route: ActivatedRoute,
		protected request: RequestService,
	) { }

	paramSub:	Subscription;
	qparamSub:	Subscription;
	qparams:	Params;
	item: Item;

	// current user
	currentUser: User;


	ngOnInit() {
		// listen to changes in URL params
		this.paramSub = this.route.params.subscribe (
			params => this.loadItem ( +params.id )
		);

		// listen to changes in query params
		this.qparams = { requested: '0' };
		this.qparamSub = this.route.queryParams.subscribe (
			params => this.qparams = params
		)

		// load currentuser from HttpService
		this.currentUser = this.http.getCurrentUser();
	}

	/**
	 * Given an item id, request more info about that item
	 * @param id item id
	 */
	loadItem ( id: number ) : void {
		let path: string = `/items/${id}`;
		this.http.getObservable ( path ).subscribe (
			data => {
				this.item = new Item(data);
				console.log ( 'loadItem', this.item, id==data['id'] );
			},
			(err: HttpErrorResponse) => 
				this.http.genericModelErrorHandler(err, Model.Item)
		);
	}


	requestLength: string = "7";
	requestSubmitted: boolean = false;
	/**
	 * Submit a request to borrow an item
	 */
	requestItem () : void {
		// first, redirect to a splash page and ask user to enter how many days they'd like to borrow the item
		let extras: NavigationExtras = {
			queryParams: { requested: 1 }
		}
		this.router.navigate ([], extras );
	}

	submitItemRequest () {
		// extract an integer from the string
		let requestDays: number = +this.requestLength;
		if ( !requestDays ){
			this.alert.warning ( "Please stop being an idiot and enter a number." );
			return;
		}

		this.alert.info ( `Requesting this item for ${requestDays} days` );
		this.request.requestItem ( +this.item.id, requestDays ).subscribe (
			res => {
				console.log ('requestItem', res);
				this.alert.clear();
				this.requestSubmitted = true;
			},
			(err: HttpErrorResponse) =>
				this.handleHttpError (err)
		)
	}

	/**
	 * Specialized error handler; return true if error handled
	 * @param err HttpErrorResponse instance
	 */
	handleHttpError ( err: HttpErrorResponse ) : boolean {
		// first determine if this is a generic HTTP error (i.e. 404, 500, etc)
		let genericError: boolean = this.http.genericModelErrorHandler(err, Model.Item);
		if ( genericError ) return genericError;

		// otherwise, try to handle it
		if ( err.status == 422 ) {
			// not allowed to request this item, either b/c it belongs to you, or you've already requested it
			console.error ( err.error['message'] );
			this.alert.error ( err.error['message'] );
			return true;
		}

		this.alert.error ( "Unexpected error. Please inform the code monkeys behind this project." );
		return false;
	}


	/**
	 * Navigate to the public profile page of the item owner
	 */
	navigateToOwnerProfile () : void {
		let path: Array<string> = ['/user', this.item.user.id.toString()];
		this.router.navigate(path);
	}


	deleteConfirmation: boolean = false;
	/** Delete this item; if item is currently loaned out, prompt for confirmation */
	deleteItem () : void {
		if ( this.item.loan_active  && !this.deleteConfirmation ) {
			this.alert.warning ( "This item is currently loaned out. Are you sure you want to delete it? Click delete again to confirm." );
			this.deleteConfirmation = true;
		} else {
			let path: string = `/items/${this.item.id}`;
			this.http.deleteObservable(path).subscribe(
				data => {
					this.alert.success ( 'Item successfully deleted.', true );
					this.router.navigate (['/']);		// return to home page
				},
				err => this.handleHttpError (err)
			)
		}
	}

	/** Navigate to page to allow user to edit the details of this item */
	navigateToEdit() {
		let path : string[] = [ '/item', 'edit', this.item.id.toString() ];
		this.router.navigate(path);
	}


	/**
	 * Remove a request from the array of requests
	 * @param index index of request to remove; NOT the item or request id
	 */
	removeRequest ( index: number ) : void {
		this.item.requests.splice(index,1);
	}


	/** Navigate back the the main item details view */
	returnToItemDetails ( reload: boolean = false ) {
		this.router.navigate ([]);
		if ( reload ) {
			let id: number = +this.route.snapshot.params['id'];
			this.loadItem(id);
		}
	}


	/** Redirect to search page and enter the search string */
	searchHashtag ( hashtag: string ) {
		let path: string[] = ['/search'];
		let qparams: NavigationExtras = { queryParams: {q: hashtag} };
		this.router.navigate ( path, qparams );
	}


	/** Item owner: mark item as returned. */
	markAsReturned ( loan: Loan ) : void {
		let path: string = `/loans/mark_as_returned`;
		let payload: object = { id: loan.id };
		this.http.postObservable ( path, payload ).subscribe (
			res => {
				this.alert.success ( "You've successfully marked the item as returned!" )
			},
			err => this.http.genericModelErrorHandler(err),
		)
	}

}
