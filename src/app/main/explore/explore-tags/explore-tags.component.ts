import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { Hashtag, Item } from 'src/app/_models/models';

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
		if ( this.hashtags.length ){
			this.tagIndexSelected = this.tagIndexSelected ? this.tagIndexSelected : 0;
			this.changeHashtag(this.tagIndexSelected);
		}
			
		console.log ( 'handleHashtagsIndex', this.hashtags );
	}

	changeHashtag ( index: number ) {
		this.tagIndexSelected = index;

		// do a request for items associated with this hashtag
		let path: string = `/hashtags?id=${this.hashtags[index].id}`;
		this.http.getObservable (path).subscribe (
			data => {
				this.handleHashtagsShow(index, data);
			},
			err => this.http.genericModelErrorHandler(err),
		)
	}
	handleHashtagsShow ( index: number, data: object ) {
		let items_with_hashtag: object[] = data['items_with_hashtag'] || [];
		this.hashtags[index].items = items_with_hashtag.map (
			item => new Item(item)
		)
	}
}
