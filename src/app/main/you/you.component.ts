import { Component } from '@angular/core';
import { ProfileComponent } from '../profile/profile.component';
import { User } from 'src/app/_models/models';
import { Model } from 'src/app/http.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'app-you',
	templateUrl: '../profile/profile.component.html',
	styleUrls: ['../profile/profile.component.css']
})
export class YouComponent extends ProfileComponent {


	ngOnInit() {
		// load default, empty user
		this.currentUser = this.http.getCurrentUser();

		this.loadYou();
	}


	private loadYou () : void {
		let path: string = '/users/you';
		this.http.getObservable ( path ).subscribe (
			data => {
				console.log ( 'loadYou', data );
				this.currentUser = new User(data);
				this.you = true;
			},
			(err: HttpErrorResponse) => this.http.genericModelErrorHandler(err, Model.User),
		)
	}

}
