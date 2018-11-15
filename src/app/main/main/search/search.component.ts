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

	searchString: string;

	ngOnInit() {
		this.fullScreen = true;

		// subscribe to 
		this.qparams = this.route.snapshot.queryParamMap;
		this.qparamsSub = this.route.queryParams.subscribe (
			qparams => {
				this.qparams = qparams;
				this.searchString = qparams['q'];
				this.performSearch ( qparams['q'] );
			}
		)
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
	performSearch ( query: string ) : void {
		if (!query) return;
		let path = `/items/?search_item=${query}`;
		this.http.getObservable ( path ).subscribe (
			res => {
				this.searchResults = res;
				console.log ( 'search', res );
			},
			err => this.http.genericModelErrorHandler(err)
		);

		// un-fullscreen the search bar after a search is performed
		this.fullScreen = false;
	}



	ngOnDestroy () {
		this.qparamsSub.unsubscribe();
	}
}
