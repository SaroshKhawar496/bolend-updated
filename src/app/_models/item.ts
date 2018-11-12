export class Item {
	id: string | number;
	name: string = "";
	description: string = "";
	url: string = "";
	tags: string | Array<string>;

	imgUrl: string;			// main image; more images are allowed
	imgSrc: string | ArrayBuffer;	// src buffer of main image

	constructor ( attribs?: object ) {
		if ( attribs ){
			for ( var p in attribs )
				this[p] = attribs[p];
		}
	}
}
