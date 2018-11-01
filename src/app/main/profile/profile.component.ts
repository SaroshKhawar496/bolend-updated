import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
import { User } from '../../_models/user';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

	currentUser: User;

	constructor ( 
		private http: HttpService
	) { }

	ngOnInit () {
		this.loadCurrentUser();
	}

	loadCurrentUser () : void {
		this.currentUser = this.http.getCurrentUser();
	}
}
