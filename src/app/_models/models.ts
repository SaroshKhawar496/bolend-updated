import { timeDelta } from "../utils/app-utils";


export class ExtensibleModel {
	/**
	 * Initialize an object with attribs by assigning every property from input object to this object
	 * @param attribs object containing properties to be copied
	 */
	constructor ( attribs?: object ) {
		if ( attribs ) {
			for ( let prop in attribs )
				this[prop] = attribs[prop];
		}
	}
}



export class User extends ExtensibleModel {
	id: number;
	fname: string;
	lname: string;
	address: string;        // optional
	phone: string;          // optional
	email: string;
	gender: string;         // optional
	dateofbirth: Date;

	created_at: Date;
	updated_at: Date;
	profileImgUrl: string;
	privateMode: boolean;

	items: Array<object>;
	itemsAvailable: Array<Item>;

	jwt: JWT;

	// dob: Date;
	// dobReadable: string;


	/**
	 * Instantiate a User object, optionally providing an object with attributes required for 
	 * @param attribs 
	 */
	constructor ( attribs?: object, jwtStr?: string ) {
		super(attribs);

		// assign 'Anon' as first name if it is undefined
		if ( !this.fname ) this.fname = 'Anon';

		if ( jwtStr ) {
			console.log ( 'jwtStr', jwtStr );
			this.jwt = new JWT (jwtStr);
		}

		// parse user's items available
		if ( attribs && attribs['items'] )
			this.parseItems ( this.items, 'itemsAvailable' );
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

	get fullName() { return `${this.fname} ${this.lname || ''}`; }

	/**
	 * Return a subset of properties of this user - enough to identify them
	 */
	get userIdentity() : object {
		return {
			id: this.id, fname: this.fname, lname: this.lname, 
			fullName: this.fullName,
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
	}
}



export class Item extends ExtensibleModel {
	id: string | number;
	name: string;
	description: string;
	url: string;
	tags: string | Array<string>;
	requests: ItemRequest[];

	image: string;			// main image URL
	imgSrc: string | ArrayBuffer;	// src buffer of main image

	user: User;				// owner

	created_at: Date;
	updated_at: Date;
	age: string;

	loan: Loan;

	constructor ( attribs?: object ) {
		super(attribs);
		// if the object has a 'user' property, create an instance of user
		if ( attribs && attribs['user'] )
			this.createUserInstance ( attribs['user'] );

		// create age string if updated_at is present
		if ( this.updated_at )
			this.age = timeDelta(this.updated_at);

		// if requests array is present
		if ( this.requests ) {
			this.requests = this.requests.map ( 
				request => new ItemRequest(request)
			);
		}

		// if loan is present
		if ( this.loan ) {
			this.loan = new Loan(this.loan);
		}
	}

	createUserInstance ( userData: object ) {
		this.user = new User(userData);
	}
}


export class ItemRequest extends ExtensibleModel {
	id: string | number;
	requesting_user: User;
	request_status: string;

	constructor (attribs) {
		super(attribs);
		
		// if requesting_user is provided, create an isntance of User with it
		if ( this.requesting_user )
			this.requesting_user = new User ( this.requesting_user );
	}
}


export class Loan extends ExtensibleModel {
	id:			number;
	user_id:	number;
	item_id:	number;

	created_at:	Date;
	updated_at: Date;
	duedate:	Date;
	age:		string;
	timeToDue:	string;

	constructor ( attribs?: object ) {
		super(attribs);

		// compute the age and timeToDue strings, using updated_at and duedate respectively
		if ( this.updated_at )
			this.age = timeDelta (this.updated_at);
		if ( this.duedate )
			this.timeToDue = timeDelta (this.duedate);
	}
}