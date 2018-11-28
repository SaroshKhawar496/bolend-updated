import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/utils/alert/alert.service';



@Component({
	selector: 'app-explore',
	templateUrl: './explore.component.html',
	styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {

	constructor (
		protected http: HttpService,
		protected router: Router,
		protected alert: AlertService,
	) { }

	ngOnInit() {
	}


}

export const ExploreTabs = {
	
}

export class ExploreTab {

}