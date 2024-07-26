import { Application } from 'express';
import apiRoutes from './api.routes';

export { init };

function init(app: Application): void {
  app.use(apiRoutes);
  console.info('[api.index.init] Api handler initialized!');
}
