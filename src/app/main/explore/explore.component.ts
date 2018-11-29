import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { AlertService } from 'src/app/utils/alert/alert.service';
import { Subscription } from 'rxjs';



@Component({
	selector: 'app-explore',
	templateUrl: './explore.component.html',
	styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit, OnDestroy {

	constructor (
		protected http: HttpService,
		protected router: Router,
		protected route: ActivatedRoute,
		protected alert: AlertService,
	) { }

	selectedTab: string;
	urlSub: Subscription;
	ngOnInit() {
		this.urlSub = this.route.url.subscribe (
			url => this.handleNavChanges(this.router.url)
		)
	}

	ngOnDestroy () {

	}

	/**
	 * Navigate relatively to the tab specified
	 */
	changeTab ( tab: string ) {
		this.router.navigate ([ '..', tab ]);
	}

	/**
	 * Handle changes when a router navigation is performed
	 * @param path location.pathname
	 */
	handleNavChanges (path: string) {
		let pathArray: string[] = path.split('/');
		this.selectedTab = pathArray [ pathArray.length-1 ].toString();
		console.log ( 'handleNavChanges', pathArray, this.selectedTab );
	}

}

export const ExploreTabs = {
	
}

export class ExploreTab {

}