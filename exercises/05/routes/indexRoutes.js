import { Router } from 'express';

const indexRouter = Router();
indexRouter.get('/', (req, res) => res.send('Welcome page for the API ( books :) )!'));



export default indexRouter;