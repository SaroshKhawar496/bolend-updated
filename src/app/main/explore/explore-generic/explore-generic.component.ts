import { Component, OnInit } from '@angular/core';
import { Item } from 'src/app/_models/models';
import { HttpService } from 'src/app/http.service';
import { AlertService } from 'src/app/utils/alert/alert.service';
import { Router } from '@angular/router';
import { Pagination } from 'src/app/utils/app-utils';
import { HttpHeaders } from '@angular/common/http';
import { ExploreResultsOptions } from '../explore-results/explore-results.component';

@Component({
	selector: 'app-explore-generic',
	templateUrl: './explore-generic.component.html',
	styleUrls: ['../explore.component.css']
})
export class ExploreGenericComponent implements OnInit {

	items: Item[] = [];
	pages: Pagination;
	resultsOptions: ExploreResultsOptions = {};

	constructor (
		protected http: HttpService,
		protected alert: AlertService,
		protected router: Router,
	) { }

	ngOnInit() {
		this.invokeFetchItems();
	}

	/** Overload this method in each inherited class */
	invokeFetchItems () : void {}


	/**
	 * Do HTTP GET request with the specified path
	 * @param path url path
	 */
	fetchItems ( path: string ) : void {
		this.http.getObservable (path).subscribe(
			data => this.handleItemsFetched(path, data),
			err => this.http.genericModelErrorHandler(err),
		);
	}


	/** Handle results returned from `fetchItems()` */
	handleItemsFetched ( path: string, data: object, append: boolean = false ) {

		// parse the raw array and initialize the array of items
		let rawItemArray: object[] = data['items'];
		if ( rawItemArray && Array.isArray(rawItemArray) ) {
			let itemArr: Item[] = rawItemArray.map(	item => new Item (item)	);
			this.items = append ? this.items.concat(itemArr) : itemArr
		}

		// if pagination info is available, save it
		let pageObj: object = data['pages'];
		if ( pageObj && typeof pageObj == 'object' ) {
			this.pages = <Pagination>pageObj;
			this.pages.path = path;			// save the path used in the request for pagination
		}
	}


	/** Load the next page, if pagination is enabled */
	loadNextPage () : Pagination {
		console.log ( 'loadNextPage', this.pages );
		if ( this.pages && this.pages.path ) {
			// check if this is the last page; if so, inform user and do nothing
			if ( this.pages.page == this.pages.total_pages ) {
				this.alert.info ( "You have reached the last page of results." );
				return;
			}

			// to load the next page, first increment the page number
			this.pages.page++;
			let paginationHeaders: HttpHeaders = new HttpHeaders ({
				'page': this.pages.page.toString(),
				'perpage': this.pages.perpage.toString() || null,
			});
			this.http.getObservable ( this.pages.path, paginationHeaders ).subscribe (
				data => this.handleItemsFetched ( this.pages.path, data, true ),	// specify append=true
				err => this.http.genericModelErrorHandler(err),
			);

			return this.pages
		}
		else return null;
	}

}



@Component({
	selector: 'app-explore-new',
	templateUrl: './explore-generic.component.html',
	styleUrls: ['../explore.component.css'],
})
export class ExploreNewComponent extends ExploreGenericComponent {

	// enable pagination
	resultsOptions: ExploreResultsOptions = {
		paginated: true,
	}

	/** Fetch items sorted by last updated (i.e. updated_at descending order) first */
	invokeFetchItems () : void {
		let path: string = `/items/new`;
		this.fetchItems ( path );
	}

}