import express from 'express';
import cors from 'cors';
import path from 'path';

import { config } from './config';
import { routes } from './routes';
import { RouteHandling } from './middlewares/route-handling';

const app = express();

app.use(express.json());
app.use(cors({
  origin: [config.baseUrl.client],
}));
app.use(express.urlencoded({ extended: true }));

app.use('/screenshots', express.static(path.join(__dirname, 'assets/screenshots')));
app.use('/screensavers', express.static(path.join(__dirname, 'assets/screensavers')));

RouteHandling.useAllRoutes(app, routes);
app.all('*', RouteHandling.handleNotFoundRoutes);

export { app };
