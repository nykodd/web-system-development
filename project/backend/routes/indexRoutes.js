import { Router } from 'express';

const indexRouter = Router();

indexRouter.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
    });
});

export default indexRouter;
