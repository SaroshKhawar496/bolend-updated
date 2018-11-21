import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import { Subscription } from 'rxjs';


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
		protected route: ActivatedRoute
	) { }

	fullScreen: boolean;
	qparamsSub: Subscription;
	qparams:	Params;
	searchResults: object;
	resultPagination: {
		items: Pagination,
		users: Pagination,
	}

	searchString: string;

	ngOnInit() {
		this.fullScreen = true;

		// initialize results object to empty obj, and set up pagination of results with default values
		this.searchResults = {};
		this.resultPagination = { 
			items: { currPage: 1, resultsPerPage: 10},
			users: null,					// do not paginate users (for now)
		};

		// subscribe to 
		this.qparams = this.route.snapshot.queryParamMap;
		this.qparamsSub = this.route.queryParams.subscribe (
			qparams => {
				this.handleQparamsChange(qparams);
			}
		)
	}

	handleQparamsChange ( qparams: Params ) : void {
		this.qparams = qparams;
		this.searchString = qparams['q'];

		// perform items search
		this.performSearch ( "items", this.searchString );

		// perform users search
		this.performSearch ( "users", this.searchString );
	}


	/**
	 * Trigger performSearch by navigating with an updated search string
	 */
	updateSearch () : void {
		let queryParams: NavigationExtras = { queryParams: {
			q: this.searchString
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
		let path = `/${type}/?query=${query}`;



		// perform query
		this.http.getObservable ( path ).subscribe (
			res => this.handleSearchResults ( res, type ),
			err => this.http.genericModelErrorHandler(err)
		);

		// un-fullscreen the search bar after a search is performed
		this.fullScreen = false;
	}


	/** parse the results of a search */
	handleSearchResults ( res: object, type: string ) : object {
		this.searchResults[type] = res[type];
		console.log ( `Updating search results of type ${type}.`, this.searchResults );
		return res[type];
	}


	/**
	 * If paginated, load an additional page of the specified type of search results
	 * @param event 
	 */
	loadPage ( event: any ) {
		console.log ( 'loadMore', event );
		if ( this.resultPagination[event] ) {
			console.log ( this.resultPagination[event] );
		}
	}


	ngOnDestroy () {
		this.qparamsSub.unsubscribe();
	}
}


export interface Pagination {
	currPage: number;
	resultsPerPage: number;
	totalPages?: number;
	totalResults?: number;
}