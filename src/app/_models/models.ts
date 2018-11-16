// import { Item } from "./item";

export class User {
	id: number;
	fname: string = "Anon";
	lname: string;
	address: string;        // optional
	phone: string;          // optional
	email: string;
	gender: string;         // optional
	dateofbirth: string;

	created_at: string;
	updated_at: string;
	profileImgUrl: string;

	items: Array<object>;
	itemsAvailable: Array<Item>;

	jwt: JWT;

	dob: Date;
	dobReadable: string;
	created_date: Date;
	created_readable: string;
	updated_date: Date;
	updated_readable: string;


	/**
	 * Instantiate a User object, optionally providing an object with attributes required for 
	 * @param attribs 
	 */
	constructor ( attribs?: object, jwtStr?: string ) {
		if ( attribs ) {
			for ( var p in attribs )
				this[p] = attribs[p];
		}
		if ( jwtStr ) {
			console.log ( 'jwtStr', jwtStr );
			this.jwt = new JWT (jwtStr);
		}

		// convert string dates to Date objects
		this.dateStrToObj();

		// parse user's items available
		console.log ( this );
		if ( attribs && attribs['items'] )
			this.parseItems ( this.items, 'itemsAvailable' );
	}

	dateStrToObj () : void {
		// convert string dates to Date objects
		if (this.dateofbirth){
			this.dob = new Date ( this.dateofbirth );
		}
		if (this.created_at)
			this.created_date = new Date ( this.created_at );
		if (this.updated_at)
			this.updated_date = new Date ( this.updated_at);
	}

	/**
	 * Create instances of Item object for each object in array
	 * @param source array of objects, each containing info about an item
	 * @param assignTo the class variable to assign the parsed array to
	 */
	parseItems ( source: Array<object>, assignTo: string ) : void {
		if ( !source ) return;

		let itemList: Array<Item> = [];
		for ( let item of source ) {
			itemList.push ( new Item(item) );
		}
		this[assignTo] = itemList;
	}

	get fullName() { return `${this.fname} ${this.lname}`; }

	/**
	 * Return a subset of properties of this user - enough to identify them
	 */
	get userIdentity() : object {
		return {
			id: this.id, fname: this.fname, lname: this.lname, 
			fullName: `${this.fname} ${this.lname}`,
		}
	}
}



/*
	A JWT token consists of a header, payload, and signature. 
	The header & payload are base64 encoded, and the signature is appended to the end, following a '.' character
*/
export class JWT {
	public static tokenAuthPrefix: string = "Bearer ";
	tokenString: string;
	tokenHeader: object;
	tokenPayload: object;
	tokenSignature: string;

	/**
	 * Parse a base64 encoded JWT string into JWT object
	 * @param token base64 encoded JWT string
	 */
	constructor ( token: string ){
		this.tokenString = token;
		token = token.replace ( JWT.tokenAuthPrefix, '' );
		let split: Array<string> = token.split('.');

		this.tokenHeader = JSON.parse ( atob(split[0]) );
		this.tokenPayload = JSON.parse ( atob(split[1]) );
		this.tokenSignature = split[2];

		console.log (
			'JWT: header payload signature', 
			this.tokenHeader, 
			this.tokenPayload,
			this.tokenSignature
		);
	}
}



export class Item {
	id: string | number;
	name: string = "";
	description: string = "";
	url: string = "";
	tags: string | Array<string>;

	imgUrl: string;			// main image; more images are allowed
	imgSrc: string | ArrayBuffer;	// src buffer of main image

	user: User;

	constructor ( attribs?: object ) {
		if ( attribs ){
			for ( var p in attribs )
				this[p] = attribs[p];
		}
		
		// if the object has a 'user' property, create an instance of user
		if ( attribs && attribs['user'] )
			this.createUserInstance ( attribs['user'] );
	}

	createUserInstance ( userData: object ) {
		this.user = new User(userData);
	}
}
