import { Router } from 'express';
import { rootEndpoint } from '../controllers/root.controller';
import {
  createCustomMessage,
  greetUser,
} from '../controllers/message.controller';
import { performMathOperation } from '../controllers/math.controller';
import { config } from '../config/config';

const router = Router();

const API: string = `/api/v${config.apiVersion}`;

// Root endpoint
router.get(API, rootEndpoint);

// Message endpoints
router.post(`${API}/greet`, greetUser);
router.post(`${API}/message`, createCustomMessage);

// Math operations
router.post(`${API}/math`, performMathOperation);

export default router;
