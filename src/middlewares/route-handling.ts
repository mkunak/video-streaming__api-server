import { Express, Request, Response, NextFunction, Router } from 'express';

import { NotFoundError } from '../errors';

type TRoutes = {
  [version: string]: Router;
}

class RouteHandling {
  static generalReason = 'Something went wrong';

  static async handleNotFoundRoutes(req: Request, res: Response, next: NextFunction) {
    console.log('>>> handleNotFoundRoutes > baseUrl:', req.originalUrl);
    throw new NotFoundError();
  }

  static useAllRoutes(app: Express, routes: TRoutes): void {
    Object.keys(routes).forEach(route => {
      app.use(`/${route}`, routes[route]);
    });
  };
  
}

export { RouteHandling };
