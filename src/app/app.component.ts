// core, components, services
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from './http.service';
// import { LoginComponent } from './login/login.component';



@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent {
	title = 'BoLend';
	sidebarHidden = true;
	navigationDislay = true;

	constructor (
		public activeRoute: ActivatedRoute,
		private http: HttpService
	) {
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

	public logout () : void {
		this.http.logout();
	}


	
	// // for a good kek
	// public fuckMyShitUp () {
	// 	console.log ("Pls to halp!")
	// 	var cssId = 'myCss';  // you could encode the css path itself to generate id..
	// 	if (!document.getElementById(cssId))
	// 	{
	// 		var head  = document.getElementsByTagName('head')[0];
	// 		var link  = document.createElement('link');
	// 		link.id   = cssId;
	// 		link.rel  = 'stylesheet';
	// 		link.type = 'text/css';
	// 		link.href = 'assets/kek/ooo3.css';
	// 		link.media = 'all';
	// 		head.appendChild(link);
	// 	}
	// }
}
