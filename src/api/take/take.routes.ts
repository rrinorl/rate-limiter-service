import express from 'express';
import * as takeController from './take.controller';
import { handleAsync } from '../../utils/middleware';

const router = express.Router();

export = router;

router.post('/', handleAsync(takeController.post));
