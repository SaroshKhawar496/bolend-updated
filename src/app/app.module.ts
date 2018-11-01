import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// utils
import { CustomReuseStrategy } from './reuse-strategy';
import { ErrorInterceptor } from './utils/error.interceptor';
import { JwtInterceptor } from './utils/jwt.interceptor';
import { AuthGuard } from './utils/auth.guard';
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
	{ path: '', component: DashboardComponent, canActivate: [AuthGuard] },
	{ path: 'dashboard', redirectTo: '', pathMatch: 'full' },

	// login page; if a page requires authentication,
	// user will be redirected here if they are not already authenticated
	{ path: 'login', component: LoginComponent },

	// user profile page
	{ path: 'you', component: DashboardComponent, canActivate: [AuthGuard] }
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
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
		{ provide: RouteReuseStrategy, useClass: CustomReuseStrategy },
		AuthGuard
	],
	bootstrap: [
		AppComponent
	]
})
export class AppModule { }
