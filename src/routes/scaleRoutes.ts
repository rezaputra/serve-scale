import { Router } from 'express';
import { getScale } from '../contollers/scaleController';
import { getImprovedScale } from '../contollers/scaleImpovedController';
import { testScale } from '../contollers/scaleTestController';

const router = Router()

router.get('/scale', getScale)
router.get('/', getImprovedScale)
router.get('/scale-test', testScale)

export default router;
