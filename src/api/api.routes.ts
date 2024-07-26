import { Router } from 'express';
import { errorHandler } from '../utils/middleware';
import takeRoutes from './take/take.routes';

const router = Router();

export = router;

router.use('/take', takeRoutes);

// Global error handler
router.use(errorHandler);
