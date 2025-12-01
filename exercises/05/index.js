import bookRouter from './routes/bookRoutes.js';
import indexRouter from './routes/indexRoutes.js';
import express from 'express';

import 'dotenv/config';


const app = express();

// Middleware
app.use(express.json());

app.use(express.static('public'));

// Routes
app.use('/books', bookRouter);
app.use('/', indexRouter);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`My first Express app - listening on port ${PORT}!`);
});
