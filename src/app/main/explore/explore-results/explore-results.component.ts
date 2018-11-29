import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Item } from 'src/app/_models/models';

@Component({
	selector: 'app-explore-results',
	templateUrl: './explore-results.component.html',
	styleUrls: ['../explore.component.css']
})
export class ExploreResultsComponent implements OnInit {
	@Input() items: Item[];
	@Input() options?: ExploreResultsOptions = {};
	@Output() loadPage: EventEmitter<boolean> = new EventEmitter<boolean>();

	constructor () { }

	ngOnInit () {
	}

	/** Emit event to prompt parent component to load more results (using pagination), if enabled */
	loadMoreItems () {
		this.loadPage.emit(true);
	}

}



export interface ExploreResultsOptions {
	// any property not specified is undefined; recall that undefined is falsy

	// is pagination enabled? i.e. display a "load more items" button?
	paginated?: boolean;
}