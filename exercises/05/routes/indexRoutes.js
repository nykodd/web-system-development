import { Router } from 'express';

const indexRouter = Router();
indexRouter.get('/', (req, res) => res.send('Welcome page!'));



export default indexRouter;