import { Component, OnInit } from '@angular/core';
import { Item } from 'src/app/_models/models';
import { HttpService } from 'src/app/http.service';
import { AlertService } from 'src/app/utils/alert/alert.service';
import { Router } from '@angular/router';
import { Pagination } from 'src/app/utils/app-utils';

@Component({
	selector: 'app-explore-generic',
	templateUrl: './explore-generic.component.html',
	styleUrls: ['../explore.component.css']
})
export class ExploreGenericComponent implements OnInit {

	items: Item[];
	pages: Pagination;

	constructor (
		protected http: HttpService,
		protected alert: AlertService,
		protected router: Router,
	) { }

	ngOnInit() {
		this.fetchItems();
	}

	/** Overload this method in components that extend this template */
	fetchItems () : void {}

	
	/** Handle results returned from `fetchItems()` */
	handleItemsFetched ( data: object ) {
		let rawItemArray: object[] = data['items'];
		if ( rawItemArray && Array.isArray(rawItemArray) ) {
			this.items = rawItemArray.map(
				item => new Item (item)
			);
		}

		// if pagination info is available, save it
		let pageObj: object = data['pages'];
		if ( pageObj && typeof pageObj == 'object' ) {
			this.pages = <Pagination>pageObj;
		}
	}

}



@Component({
	selector: 'app-explore-new',
	templateUrl: './explore-generic.component.html',
	styleUrls: ['../explore.component.css'],
})
export class ExploreNewComponent extends ExploreGenericComponent {
	/** Get a list of items, sorted by newest first (i.e. item id, high to low) */
	fetchItems () : void {
		let path: string = `/items`;
		this.http.getObservable (path).subscribe(
			data => this.handleItemsFetched(data),
			err => this.http.genericModelErrorHandler(err),
		);
	}
}