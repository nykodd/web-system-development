import { Router } from 'express';
import { getStatusById, getStatuses,
    //  createStatus, updateStatus, deleteStatus 
    } from '../controllers/statusController.js';

const statusRouter = Router();
statusRouter.get('/', getStatuses);
statusRouter.get('/:id', getStatusById);
// statusRouter.post('/', createStatus);
// statusRouter.put('/:id', updateStatus);
// statusRouter.delete('/:id', deleteStatus);

export default statusRouter;
