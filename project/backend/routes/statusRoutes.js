import { Router } from 'express';
import { getStatusById, getStatuses } from '../controllers/statusController.js';

const statusRouter = Router();
statusRouter.get('/', getStatuses);
statusRouter.get('/:id', getStatusById);

export default statusRouter;
