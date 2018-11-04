// credit for this workaround goes to dmitrimaltsev and ishor13. see https://github.com/angular/angular/issues/13869
// slightly modified to update redirects when a route is reused

import {RouteReuseStrategy, DefaultUrlSerializer, ActivatedRouteSnapshot, DetachedRouteHandle} from "@angular/router";
import { Injectable } from  '@angular/core'

interface IRouteConfigData {
  reuse: boolean;
}

interface ICachedRoute {
  handle: DetachedRouteHandle;
  data: IRouteConfigData;
}

@Injectable()
export class MaltsevRouteReuseStrategy implements RouteReuseStrategy {
  private routeCache = new Map<string, ICachedRoute>();

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    let ret = future.routeConfig === curr.routeConfig;
    if (ret) {
      this.addRedirectsRecursively(future); // update redirects
    }
    return ret;
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    const data = this.getRouteData(route);
    return data && data.reuse;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    const url = this.getFullRouteUrl(route);
    const data = this.getRouteData(route);
    this.routeCache.set(url, { handle, data });
    this.addRedirectsRecursively(route);
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const url = this.getFullRouteUrl(route);
    return this.routeCache.has(url);
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    const url = this.getFullRouteUrl(route);
    const data = this.getRouteData(route);
    return data && data.reuse && this.routeCache.has(url)
      ? this.routeCache.get(url).handle
      : null;
  }

  private addRedirectsRecursively(route: ActivatedRouteSnapshot): void {
    const config = route.routeConfig;
    if (config) {
      if (!config.loadChildren) {
        const routeFirstChild = route.firstChild;
        const routeFirstChildUrl = routeFirstChild
          ? this.getRouteUrlPaths(routeFirstChild).join('/')
          : '';
        const childConfigs = config.children;
        if (childConfigs) {
          const childConfigWithRedirect = childConfigs.find(c => c.path === '' && !!c.redirectTo);
          if (childConfigWithRedirect) {
            childConfigWithRedirect.redirectTo = routeFirstChildUrl;
          }
        }
      }
      route.children.forEach(childRoute => this.addRedirectsRecursively(childRoute));
    }
  }

  private getFullRouteUrl(route: ActivatedRouteSnapshot): string {
    return this.getFullRouteUrlPaths(route).filter(Boolean).join('/');
  }

  private getFullRouteUrlPaths(route: ActivatedRouteSnapshot): string[] {
    const paths = this.getRouteUrlPaths(route);
    return route.parent
      ? [ ...this.getFullRouteUrlPaths(route.parent), ...paths ]
      : paths;
  }

  private getRouteUrlPaths(route: ActivatedRouteSnapshot): string[] {
    return route.url.map(urlSegment => urlSegment.path);
  }

  private getRouteData(route: ActivatedRouteSnapshot): IRouteConfigData {
    return route.routeConfig && route.routeConfig.data as IRouteConfigData;
  }
}