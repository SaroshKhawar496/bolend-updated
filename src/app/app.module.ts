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
import { LoginComponent } from './accounts/login/login.component';
import { ProfileComponent } from './main/profile/profile.component';
import { YouComponent } from './main/you/you.component';
import { AccountsComponent } from './accounts/accounts.component';
import { RegisterComponent } from './accounts/register/register.component';
import { RecoverComponent } from './accounts/recover/recover.component';


// etc



// app router
const appRoutes = [
	// default home
	{ path: '', component: DashboardComponent, canActivate: [AuthGuard] },
	{ path: 'dashboard', redirectTo: '', pathMatch: 'full' },

	// accounts group:
	// user will be redirected here if they are not already authenticated
	// they will be able to access the login, register, or password recovery pages
	{ 
		path: 'accounts', 
		component: AccountsComponent,
		children: [
			{ path: '', redirectTo: 'login', pathMatch: 'full' },
			{ path: 'login', component: LoginComponent },
			{ path: 'register', component: RegisterComponent },
			{ path: 'recover', component: RecoverComponent }
		]
	},

	// user profile page
	{ path: 'you', component: ProfileComponent, canActivate: [AuthGuard] }
];



@NgModule({
	declarations: [
		AppComponent,
		DashboardComponent,
		LoginComponent,
		ProfileComponent,
		YouComponent,
		AccountsComponent,
		RegisterComponent,
		RecoverComponent,
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
