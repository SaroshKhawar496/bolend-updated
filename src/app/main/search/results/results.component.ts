import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';


@Component({
	selector: 'app-results',
	templateUrl: './results.component.html',
	styleUrls: ['../search.component.css']
})
export class ResultsComponent implements OnInit {
	@Input() searchResults: object;
	@Input() defaultTab?: ResultTab = ResultTab.All;
	@Input() searchQuery?: string;
	@Output() loadMore: EventEmitter<string> = new EventEmitter<string>();

	get s() { return this.searchResults; }			// in template, 's' can used as a shorthand for searchResults
	defaultMaxResults: 		number = 12;
	defaultMaxTypedResults: number = 6;

	// tabs
	tabs: Array<object>;
	tabSelected: number;
	tabLUT: typeof TabToProperty = TabToProperty;	// look up table; use tabSelected to make lookups
	get tabLutValues () { return Object.values(this.tabLUT); }

	constructor (
		protected router: Router,
	) { }

	ngOnInit() {
		// build an array containing the tabs
		this.tabs = Object.keys (ResultTab).filter(key => typeof ResultTab[key] === 'number').map (
			key => ({ id: ResultTab[key], name: key })
		)

		// set the default tab (tab that is initially selected)
		this.tabSelected = this.defaultTab;
	}

	/**
	 * Emit event to alert the parent component to load additional pages of a specified type.  
	 * This is used to create a never-ending scrollable page.
	 * @param type type of result to load more of; can be 'items' or 'users'
	 */
	loadMorePages ( type: string ) {
		this.loadMore.emit(type);
	}

}


export enum ResultTab {
	All = 0,
	Items = 1,
	Users = 2,
	Hashtags = 3,
}

export const TabToProperty: object = {
	1: {
		property: 'item',
		templateId: 'itemResults'
	},
	2: {
		property: 'user',
		templateId: 'userResults',
		
	},
	3: {
		property: 'hashtag',
		templateId: 'hashtagResults',
	}
}