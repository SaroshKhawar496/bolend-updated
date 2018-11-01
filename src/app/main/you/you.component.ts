import { Component, OnInit } from '@angular/core';
import { ProfileComponent } from '../profile/profile.component';
import { User } from 'src/app/_models/user';
import { HttpService } from 'src/app/http.service';

@Component({
	selector: 'app-you',
	templateUrl: './you.component.html',
	styleUrls: ['./you.component.css']
})
export class YouComponent extends ProfileComponent {

	// currentUser: User;


	ngOnInit() {
	}

}
