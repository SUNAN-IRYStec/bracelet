export type RouteParams = Record<string, string>;
export type RouteHandler = (params: RouteParams) => void;

export interface Route {
  path: string;
  handler: RouteHandler;
}

interface MatchedRoute {
  handler: RouteHandler;
  params: RouteParams;
}

class Router {
  private routes: Route[] = [];

  register(path: string, handler: RouteHandler): void {
    this.routes.push({ path, handler });
  }

  init(): void {
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  }

  navigate(path: string): void {
    window.location.hash = path;
  }

  private handleRoute(): void {
    const hash = window.location.hash.slice(1) || '/';
    const matchedRoute = this.matchRoute(hash);

    if (matchedRoute) {
      matchedRoute.handler(matchedRoute.params);
    } else {
      this.navigate('/');
    }
  }

  private matchRoute(path: string): MatchedRoute | null {
    for (const route of this.routes) {
      const params = this.extractParams(route.path, path);
      if (params !== null) {
        return { handler: route.handler, params };
      }
    }
    return null;
  }

  private extractParams(routePath: string, actualPath: string): RouteParams | null {
    const routeParts = routePath.split('/');
    const actualParts = actualPath.split('/');

    if (routeParts.length !== actualParts.length) {
      return null;
    }

    const params: RouteParams = {};

    for (let i = 0; i < routeParts.length; i++) {
      const routePart = routeParts[i];
      const actualPart = actualParts[i];

      if (routePart.startsWith(':')) {
        params[routePart.slice(1)] = actualPart;
      } else if (routePart !== actualPart) {
        return null;
      }
    }

    return params;
  }
}

export const router = new Router();
