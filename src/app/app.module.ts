import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// utils
// import { CustomReuseStrategy } from './reuse-strategy';
import { MaltsevRouteReuseStrategy } from './utils/reuse-strategy-2';
import { ErrorInterceptor } from './utils/error.interceptor';
import { JwtInterceptor } from './utils/jwt.interceptor';
import { AuthGuard } from './utils/auth.guard';
import {
	// ActivatedRoute,
	RouterModule,
	RouteReuseStrategy ,
	// DefaultUrlSerializer, ActivatedRouteSnapshot, DetachedRouteHandle
} from '@angular/router';
import { AlertService } from './utils/alert/alert.service';


// components
import { AppComponent } from './app.component';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { LoginComponent } from './accounts/login/login.component';
import { ProfileComponent } from './main/profile/profile.component';
import { YouComponent } from './main/you/you.component';
import { AccountsComponent } from './accounts/accounts.component';
import { RegisterComponent } from './accounts/register/register.component';
import { RecoverComponent } from './accounts/recover/recover.component';
import { AlertComponent } from './utils/alert/alert.component';
import { ItemCardComponent } from './main/items/item-card/item-card.component';
import { ResetComponent } from './accounts/reset/reset.component';
import { NewItemComponent } from './main/items/new-item/new-item.component';
import { ItemDetailsComponent } from './main/items/item-details/item-details.component';
import { SearchComponent } from './main/search/search.component';
import { ResultsComponent } from './main/search/results/results.component';
import { SocialComponent } from './main/social/social.component';
import { NotificationsComponent } from './main/notifications/notifications.component';
import { NotificationCardComponent } from './main/notifications/notification-card/notification-card.component';
import { ProfileCardComponent } from './main/profile/profile-card/profile-card.component';
import { FriendsComponent } from './main/social/friends/friends.component';
import { EditItemComponent } from './main/items/new-item/edit-item.component';
import { ItemRequestCardComponent } from './main/items/item-request-card/item-request-card.component';
import { ExploreComponent } from './main/explore/explore.component';
import { ExploreTagsComponent } from './main/explore/explore-tags/explore-tags.component';
import { ExploreResultsComponent } from './main/explore/explore-results/explore-results.component';
import { 
	ExploreGenericComponent,
	ExploreNewComponent,
	ExploreTrendingComponent,
} from './main/explore/explore-generic/explore-generic.component';


// etc



// vars accessed in appRoutes

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
			{ path: 'recover', component: RecoverComponent },
			{ path: 'reset', component: ResetComponent }
		]
	},

	// user profile page
	{
		path: "user/:id",
		component: ProfileComponent,
		canActivate: [AuthGuard]
	},

	// new item
	{
		path: 'items',
		component: NewItemComponent,			// temporarily make the default items component NewItem
		canActivate: [AuthGuard],
	},
	// edit item
	{
		path: 'item/edit/:id',
		component: EditItemComponent,
		canActivate: [AuthGuard],
	},

	// item details
	{
		path: 'item/:id',
		component: ItemDetailsComponent,
		canActivate: [AuthGuard],
	},

	// search page
	{
		path: 'search',
		component: SearchComponent,
		canActivate: [AuthGuard],
	},

	// social group
	{
		path: 'social',
		component: SocialComponent,
		canActivate: [AuthGuard],
		// canActivateChild: [AuthGuard],
		children: [
			{ path: ':cat', component: FriendsComponent },
			{ path: '', redirectTo: 'friends', pathMatch: 'full' },
		]
	},

	// notifications page
	{
		path: 'notifications',
		component: NotificationsComponent,
		canActivate: [AuthGuard]
	},

	// explore page
	{
		path: 'explore',
		component: ExploreComponent,
		canActivate: [AuthGuard],
		// canActivateChild: [AuthGuard],
		children: [
			{ path: '', redirectTo: 'tags', pathMatch: 'full' },
			{ path: 'tags', component: ExploreTagsComponent },
			{ path: 'new',	component: ExploreNewComponent },
			{ path: 'trending', component: ExploreTrendingComponent },
		]
	},

	// profile page of currently authenticated user
	{ path: 'you', component: YouComponent, canActivate: [AuthGuard] }
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
		AlertComponent,
		ItemCardComponent,
		ResetComponent,
		NewItemComponent,
		ItemDetailsComponent,
		SearchComponent,
		ResultsComponent,
		SocialComponent,
		NotificationsComponent,
		NotificationCardComponent,
		ProfileCardComponent,
		FriendsComponent,
		EditItemComponent,
		ItemRequestCardComponent,
		ExploreComponent,
		ExploreTagsComponent,
		ExploreResultsComponent,
		ExploreGenericComponent,
		ExploreNewComponent,
		ExploreTrendingComponent,
	],
	imports: [
		BrowserModule,
		RouterModule.forRoot( appRoutes ),
		FormsModule,
		HttpClientModule,
		ReactiveFormsModule,
	],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
		{ provide: RouteReuseStrategy, useClass: MaltsevRouteReuseStrategy },
		// { provide: RouteReuseStrategy, useClass: CustomReuseStrategy },
		AuthGuard,
		AlertService,
	],
	bootstrap: [
		AppComponent
	]
})
export class AppModule { }
