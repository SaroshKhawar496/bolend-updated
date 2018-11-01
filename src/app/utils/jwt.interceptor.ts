import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    /**
     * Intercept outgoing HTTP requests and inject the JWT if it is available
     * @param request HttpRequest<any>
     * @param next HttpHandler
     */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // add authorization header with jwt token if available
        let currentUserToken = localStorage.getItem ( HttpService.lsTokenKey );
        if (currentUserToken) {
            request = request.clone({
                setHeaders: { 
                    Authorization: currentUserToken
                }
            });
        }

        return next.handle(request);
    }

}