import { timeDelta } from "../utils/app-utils";
import { environment } from "src/environments/environment";


export class ExtensibleModel {
	id: number;
	created_at: Date;
	updated_at: Date;
	age: string;

	/**
	 * Initialize an object with attribs by assigning every property from input object to this object
	 * @param attribs object containing properties to be copied
	 */
	constructor ( attribs?: object ) {
		if ( attribs ) {
			for ( let prop in attribs )
				this[prop] = attribs[prop];
		}

		// compute the age string, if updated_at is defined
		if ( this.updated_at )
			this.age = timeDelta(this.updated_at);
	}
}



export class User extends ExtensibleModel {
	fname: string;
	lname: string;
	address: string;        // optional
	phone: string;          // optional
	email: string;
	gender: string;         // optional
	dateofbirth: Date;

	profileImgUrl: string;
	privateMode: boolean;

	items: Array<object>;
	itemsAvailable:	Array<Item>;
	itemsBorrowed:	Array<Item>;
	itemsLoaned: Array<Item>;
	loans: Array<Loan>;

	jwt: JWT;

	private: boolean;		// is user profile private?
	friend: boolean;		// is this user your friend?
	privilege: boolean;		// do you have the privilege to view this user's profile and items?

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
		// parse items borrowed by user
		if ( attribs && attribs['items_borrowed'] && Array.isArray(attribs['items_borrowed']) ) {
			let borrowedItems: Item[] = attribs['items_borrowed'].map (
				item => new Item(item)
			);
			this.itemsBorrowed = borrowedItems;
		}
		// parse items loaned out by user
		if ( attribs && attribs['loaned_out_items'] && Array.isArray(attribs['loaned_out_items']) ) {
			// this.parseItems ( attribs['loaned_out_items'], 'itemsLoaned' );
			let rawLoans: object[] = attribs['loaned_out_items'];
			this.loans = rawLoans.map ( loan => {
				let attrs: object = {
					item: loan['item'],
					// user: loan['borrowing_user'],
				}
				attrs = Object.assign ( attrs, loan['loan'] );
				return new Loan (attrs);
			});

			this.itemsLoaned = this.loans.filter ( loan => loan.item ).map( loan => loan.item );
		}
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
	name: string;
	description: string;
	url: string;
	tags: string;
	tagArray: string[];
	requests: ItemRequest[];

	image: string;			// main image URL
	imgSrc: string | ArrayBuffer;	// src buffer of main image

	user: User;				// owner

	age: string;
	total_hits: number;
	hits_1week: number;

	loan: Loan;
	loan_active: boolean;

	constructor ( attribs?: object ) {
		super(attribs);
		// if the object has a 'user' property, create an instance of user
		if ( attribs && attribs['user'] )
			this.createUserInstance ( attribs['user'] );

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

		// if tags string is present
		if ( this.tags )
			this.tagArray = this.tags.match(/\B(\#[\w]+\b)/g);

		// if item url is available, make sure it is using https:// if in production
		if ( this.image && environment.forceImgHttps && this.image.startsWith('http://') ){
			this.image = this.image.replace('http://', 'https://');
		}
	}

	createUserInstance ( userData: object ) {
		this.user = new User(userData);
	}
}


export class ItemRequest extends ExtensibleModel {
	requesting_user?: User;
	request_status: string;
	item?: Item;
	days: number;

	constructor (attribs) {
		super(attribs);
		
		// if requesting_user is provided, create an isntance of User with it
		if ( this.requesting_user )
			this.requesting_user = new User ( this.requesting_user );

		if ( this.item )
			this.item = new Item ( this.item );
	}
}


export class Loan extends ExtensibleModel {
	id:			number;
	user_id:	number;
	user?:		User;
	item_id:	number;
	item?:		Item;

	duedate:	Date;
	age:		string;
	timeToDue:	string;
	date_of_return: Date;

	constructor ( attribs?: object ) {
		super(attribs);

		// compute the age and timeToDue strings, using updated_at and duedate respectively
		if ( this.updated_at )
			this.age = timeDelta (this.updated_at);
		if ( this.duedate )
			this.timeToDue = timeDelta (this.duedate);
		if ( this.item )
			this.item = new Item(this.item);
		if ( this.user )
			this.user = new User(this.user);
	}
}


export class Hashtag extends ExtensibleModel {
	name: string;
	items: Item[];
	items_with_hashtag: object[];

	constructor ( attribs?: object ) {
		super(attribs);

		// if items are associated with this hashtag
		if ( this.items_with_hashtag )
			this.items = this.items_with_hashtag.map (
				item => new Item(item)
			);
	}
}