import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { Hashtag } from 'src/app/_models/models';

@Component({
	selector: 'app-explore-tags',
	templateUrl: './explore-tags.component.html',
	styleUrls: ['../explore.component.css']
})
export class ExploreTagsComponent implements OnInit {

	hashtags: Hashtag[];
	tagIndexSelected: number;

	constructor (
		protected http: HttpService,
		
	) { }

	ngOnInit() {
		// get all hashtags
		this.getHashtagsIndex();
	}

	/** Request `hashtags#index` */
	getHashtagsIndex () : void {
		let path: string = '/hashtags';
		this.http.getObservable ( path ).subscribe (
			res => this.handleHashtagsIndex(res),
			err => this.http.genericModelErrorHandler(err),
		);
	}
	handleHashtagsIndex ( data: object ) {
		let rawTagsObj: object[] = data['hashtags'];
		this.hashtags = rawTagsObj.map (
			hashtag => new Hashtag(hashtag)
		);

		// if there are hashtags and tagIndexSelected is undefined or 0, set it to 0 (leave it otherwise)
		if ( this.hashtags.length )
			this.tagIndexSelected = this.tagIndexSelected ? this.tagIndexSelected : 0;
			
		console.log ( 'handleHashtagsIndex', this.hashtags );
	}
}
