export class Item {
	id: string | number;
	name: string = "";
	description: string = "";
	url: string = "";

	imgUrl: string;			// main image; more images are allowed

	constructor ( attribs?: object ) {
		if ( attribs ){
			for ( var p in attribs )
				this[p] = attribs[p];
		}
	}
}
