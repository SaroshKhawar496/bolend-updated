import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';


@Component({
	selector: 'app-results',
	templateUrl: './results.component.html',
	styleUrls: ['../search.component.css']
})
export class ResultsComponent implements OnInit {
	@Input() searchResults: object;
	@Input() defaultTab?: ResultTab = ResultTab.All;
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



}


export enum ResultTab {
	All = 0,
	Items = 1,
	Users = 2
}

export const TabToProperty: object = {
	1: {
		property: 'item',
		templateId: 'itemResults'
	},
	2: {
		property: 'user',
		templateId: 'userResults',
		
	}
}