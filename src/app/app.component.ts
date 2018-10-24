// core, components, services
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginComponent } from './login/login.component';



@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent {
	title = '444chan.';
	sidebarHidden = true;
	navigationDislay = true;

	constructor (
		public activeRoute: ActivatedRoute,
	) {
		this.activeRoute.params.subscribe ( params => {
			const snapshot = this.activeRoute.snapshot;
			console.log ( 'app-component', snapshot );
		});
	}



	// event handlers

	/**
	 * Toggle the visibility status of the sidebar
	 * @param hide specify to set to a specific value
	 */
	public toggleSidebar ( hide: boolean = undefined ): void {
		if ( hide != undefined ) {
			this.sidebarHidden = hide;
		} else {
			this.sidebarHidden = !this.sidebarHidden;
		}
	}
}
