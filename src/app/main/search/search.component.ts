import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { AlertService } from 'src/app/utils/alert/alert.service';
import { Pagination } from 'src/app/utils/app-utils';
import { Item, User } from 'src/app/_models/models';
import { UseExistingWebDriver } from 'protractor/built/driverProviders';


@Component({
	selector: 'app-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {

	/**
	 * This component contains the search bar and logic for performing the searches.  
	 * Search results will be passed to the SearchResultsComponent
	 * @param http 
	 * @param router 
	 * @param route 
	 */
	constructor (
		protected http: HttpService,
		protected router: Router,
		protected route: ActivatedRoute,
		protected alert: AlertService,
	) { }

	fullScreen: boolean;
	qparamsSub: Subscription;
	qparams:	Params;
	searchResults: object;
	pages: {
		items: Pagination,
		users: Pagination,
		hashtags: Pagination,
	}

	searchString: string;
	lastSearched: string;

	ngOnInit() {
		this.fullScreen = true;
		this.searchString = '';

		// set up pagination of results with default values
		this.initializePagination();

		// subscribe to changes in queryParams
		this.qparams = this.route.snapshot.queryParamMap;
		this.qparamsSub = this.route.queryParams.subscribe (
			qparams => {
				this.handleQparamsChange(qparams);
			}
		)
	}

	/** Initialize or reset the data structures used for pagination */
	initializePagination () : void {
		this.pages = { 
			items: null,
			users: null,							// do not paginate users (for now)
			hashtags: null,
		};
	}

	/** Handle changes in queryParams of the URL; perform new search when they change */
	handleQparamsChange ( qparams: Params ) : void {
		this.qparams = qparams;
		this.searchString = qparams['q'] || '';		// if there is no such queryParam, set to empty string
		let query: string = this.searchString.replace(/\B(\#)/g, '');

		// perform items search
		this.performSearch ( "items", query );

		// perform users search
		this.performSearch ( "users", query );

		// perform hashtags search - strip leading '#' character
		this.performSearch ( "hashtags", query );
	}


	/**
	 * Trigger performSearch by navigating with an updated search string
	 */
	updateSearch ( query: string ) : void {
		let queryParams: NavigationExtras = { queryParams: {
			q: query
		}};
		this.router.navigate ( [], queryParams );
	}


	/**
	 * Perform a search with the query string provided
	 * @param query query string; may not be undefined, null, or empty
	 */
	performSearch ( type: string, query: string ) : void {
		if (!query || !type) return;

		// build request path & headers; pagination params is sent in headers
		let path: string = `/${type}/?query=${query}`;

		// if searchResults object has not been init'd, init to empty obj
		if ( !this.searchResults )
			this.searchResults = {};

		// perform query
		this.http.getObservable ( path ).subscribe (
			res => this.handleSearchResults ( res, type ),
			err => this.http.genericModelErrorHandler(err)
		);

		// un-fullscreen the search bar after a search is performed
		this.fullScreen = false;
		this.lastSearched = query;
	}


	/** parse the results of a search */
	handleSearchResults ( res: object, type: string, concat:boolean=false ) : object {
		// save results; if concat is true, then concatenate instead of replace current results
		if ( type == "hashtags" )		// special treatment for hashtag results
			this.searchResults[type] = res['items_with_hashtag'].map ( input => new Item(input) );
		else {
			let resArr: any[] = res[type];
			switch ( type ) {
				case 'items':
					resArr = resArr.map ( input => new Item(input) );
					break;
				case 'users':
					resArr = resArr.map ( input => new User(input) );
					break;
			}
			this.searchResults[type] = concat ? this.searchResults[type].concat(resArr) : resArr ;
		}

		// check if pagination is enabled; if so, save pagination info
		if ( res['pages'] )
			this.pages[type] = res['pages'];

		console.log ( `Updating search results of type ${type}.`, this.searchResults );
		return res[type];
	}


	/**
	 * If paginated, load an additional page of the specified type of search results
	 * @param event type of search to perform
	 */
	loadPage ( type: any ) : void {
		// console.log ( 'loadMore', type );
		// check if pagination is enabled and available for this type
		if ( this.pages[type] ) {
			let p: Pagination = this.pages[type];

			// check if this is the last page
			if ( p.page == p.total_pages ) {
				this.alert.info ( "You've reached the end of results." );
				return;
			}

			p.page++;		// increment the page number
			console.log ( 'new page info', p );

			let path: string = `/${type}/?query=${this.lastSearched}`;
			let headers: HttpHeaders = new HttpHeaders({
				'page': p.page.toString(), 
				'perpage': p.perpage.toString(),
			});
			this.http.getObservable ( path, headers ).subscribe (
				res => this.handleSearchResults(res, type, true),
				err => this.http.genericModelErrorHandler(err),
			)
		} else {
			this.alert.warning ( `${type} does not support pagination yet.` );
		}
	}


	ngOnDestroy () {
		this.qparamsSub.unsubscribe();
	}
}


// export interface Pagination {
// 	page: number;
// 	perpage: number;
// 	total_results?: number;
// 	total_pages?: number;
// }