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

}


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
/*
	A JWT token consists of a header, payload, and signature. 
	The header & payload are base64 encoded, and the signature is appended to the end, following a '.' character
*/