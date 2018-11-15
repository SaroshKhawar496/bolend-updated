import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
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

	ngOnInit() {
		this.fullScreen = true;

		// subscribe to 
		this.qparamsSub = this.route.queryParams.subscribe (
			qparams => {
				this.qparams = qparams;
				this.performSearch ( qparams['q'] );
			}
		)
	}


	/**
	 * Perform a search
	 * @param query 
	 */
	performSearch ( query: string ) : void {
		let path = `/items/?search_item=${query}`;
		this.http.getObservable ( path ).subscribe (
			res => {
				this.searchResults = res;
				console.log ( 'search', res );
			},
			err => this.http.genericModelErrorHandler(err)
		);
	}



	ngOnDestroy () {
		this.qparamsSub.unsubscribe();
	}
}
