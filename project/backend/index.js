// index.js
// 95 prezentace, set up EJS + do frontend
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import indexRouter from './routes/indexRoutes.js';
import noteRouter from './routes/noteRoutes.js';
import userRouter from './routes/userRoutes.js';


import { requestLogger } from './middlewares/requestLoggerMiddleware.js';
import { unknownEndpoint } from './middlewares/unknownEndpointMiddleware.js';

const app = express();
// function myMiddleware(req, res, next) {
//     // Perform some operations
//     console.log("Middleware function called");
//     // Modify the request object
//     req.customProperty = "Hello from myMiddleware";
//     // Call the next middleware/route handler
//     next();
//     }

// Middlewares
app.use(express.json());
// app.use(myMiddleware);
app.use(requestLogger);

app.use(cors())

// Routes
app.use('/', indexRouter);
app.use('/api/notes', noteRouter);
app.use('/api/users', userRouter);


// Error handling
app.use(unknownEndpoint);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');




