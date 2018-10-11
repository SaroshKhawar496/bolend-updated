import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent {
	title = '444chan.';
	sidenavHidden = true;

	constructor() {

	}



	// event handlers

	public toggleSidebar ( hide : boolean = undefined ) : void {
		if ( hide != undefined )
			this.sidenavHidden = hide;
		else
			this.sidenavHidden = !this.sidenavHidden;
	}
}
