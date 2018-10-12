import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


// utils 
import { CustomReuseStrategy } from './reuse-strategy';
import { 
	// ActivatedRoute, 
	RouterModule, 
	RouteReuseStrategy ,
	// DefaultUrlSerializer, ActivatedRouteSnapshot, DetachedRouteHandle
} from '@angular/router';


// components
import { AppComponent } from './app.component';
import { DashboardComponent } from './main/dashboard/dashboard.component';


// etc
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



// app router
const appRoutes = [
	{ path: '', component: DashboardComponent },

	
	{ path: 'dashboard', redirectTo: '', pathMatch: 'full' },
];



@NgModule({
	declarations: [
		AppComponent,
		DashboardComponent
	],
	imports: [
		BrowserModule,
		RouterModule.forRoot( appRoutes ),
		FontAwesomeModule
	],
	providers: [{
		provide: RouteReuseStrategy, 
		useClass: CustomReuseStrategy
	}],
	bootstrap: [
		AppComponent
	]
})
export class AppModule { }
