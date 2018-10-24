import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

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
import { LoginComponent } from './login/login.component';


// etc



// app router
const appRoutes = [
	// default home
	{ path: '', component: DashboardComponent },
	{ path: 'dashboard', redirectTo: '', pathMatch: 'full' },

	// login page; if a page requires authentication,
	// user will be redirected here if they are not already authenticated
	{ path: 'login', component: LoginComponent },

	// user profile page
	{ path: 'you', component: DashboardComponent }
];



@NgModule({
	declarations: [
		AppComponent,
		DashboardComponent,
		LoginComponent
	],
	imports: [
		BrowserModule,
		RouterModule.forRoot( appRoutes ),
		FormsModule,
		HttpClientModule
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
