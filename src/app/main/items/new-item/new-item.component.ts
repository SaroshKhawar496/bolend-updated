import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-new-item',
	templateUrl: './new-item.component.html',
	styleUrls: ['./new-item.component.css']
})
export class NewItemComponent implements OnInit {

	constructor (
		protected http: HttpService,
		protected router: Router,
	) { }

	
	ngOnInit() {

	}

}
