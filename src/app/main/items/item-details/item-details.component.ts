import { Component, OnInit } from '@angular/core';
import { HttpService, Model } from 'src/app/http.service';
import { AlertService } from 'src/app/utils/alert/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Item } from 'src/app/_models/item';
import { HttpErrorResponse } from '@angular/common/http';

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
		protected route: ActivatedRoute
	) { }

	paramSub: Subscription;
	item: Item;


	ngOnInit() {
		// listen to changes in URL params
		this.paramSub = this.route.params.subscribe (
			params => this.loadItem ( +params.id )
		);
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
				console.log ( this.item );
			},
			(err: HttpErrorResponse) => 
				this.http.genericModelErrorHandler(err, Model.Item)
		)
	}

}
