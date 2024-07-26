import express, { Express } from 'express';
import morgan from 'morgan';
import cors from 'cors';

export { createExpressApp };

function createExpressApp(): Express {
  const app = express();
  app.use(cors());
  app.use(morgan('short'));
  app.use(express.json());
  app.disable('x-powered-by');
  return app;
}
