export interface Route {
  path: string;
  handler: (params: Record<string, string>) => void;
}

class Router {
  private routes: Route[] = [];

  register(path: string, handler: (params: Record<string, string>) => void): void {
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
      // Default to home
      this.navigate('/');
    }
  }

  private matchRoute(path: string): { handler: (params: Record<string, string>) => void; params: Record<string, string> } | null {
    for (const route of this.routes) {
      const params = this.extractParams(route.path, path);
      if (params !== null) {
        return { handler: route.handler, params };
      }
    }
    return null;
  }

  private extractParams(routePath: string, actualPath: string): Record<string, string> | null {
    const routeParts = routePath.split('/');
    const actualParts = actualPath.split('/');

    if (routeParts.length !== actualParts.length) {
      return null;
    }

    const params: Record<string, string> = {};

    for (let i = 0; i < routeParts.length; i++) {
      const routePart = routeParts[i];
      const actualPart = actualParts[i];

      if (routePart.startsWith(':')) {
        const paramName = routePart.slice(1);
        params[paramName] = actualPart;
      } else if (routePart !== actualPart) {
        return null;
      }
    }

    return params;
  }
}

export const router = new Router();
