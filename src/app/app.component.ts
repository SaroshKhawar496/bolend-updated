// core, components, services
import { Component } from '@angular/core';


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent {
	title = '444chan.';
	sidebarHidden = true;

	constructor() {

	}



	// event handlers

	/**
	 * Toggle the visibility status of the sidebar
	 * @param hide specify to set to a specific value
	 */
	public toggleSidebar ( hide : boolean = undefined ) : void {
		if ( hide != undefined )
			this.sidebarHidden = hide;
		else
			this.sidebarHidden = !this.sidebarHidden;
	}
}
