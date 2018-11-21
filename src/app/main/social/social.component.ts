import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-social',
	templateUrl: './social.component.html',
	styleUrls: ['./social.component.css']
})
export class SocialComponent implements OnInit {

	// get random description
	descriptions: Array<string> = [
		"Want me to spell it out for you? F-R-I-E-N-D-S",
		"Misery loves company",
		"Because it's more fun with friends.",
		"You don't get to 500 million friends without making a few enemies",
	]
	randomDescription: string;

	constructor (
		protected route: ActivatedRoute,
	) { }

	ngOnInit() {
		this.randomDescription = this.descriptions[this.descriptions.length * Math.random() | 0];
	}

}

