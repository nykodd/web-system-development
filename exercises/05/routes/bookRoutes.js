import { Router } from 'express';

let books = [
    { id: 1, title: 'R.U.R.', author: 'Karel Capek' },
    { id: 2, title: 'The Metamorphosis', author: 'Franz Kafka' },
    { id: 3, title: '451 degrees Fahrenheit', author: 'Ray Bradbury' },
    { id: 4, title: 'Bylo nas 5 (czech)', author: 'Karel Polacek' },
    { id: 5, title: 'Maj', author: 'Karel Hynek Macha' },
    { id: 6, title: 'King Lavra', author: 'Karel Havlicek Borovsky' },
];

const bookRouter = Router();

// GET all books
bookRouter.get('/', (req, res) => {
    res.json(books);
});

// GET book by id
bookRouter.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid book ID' });
    }
    
    const book = books.find(book => book.id === id);
    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }
    
    res.json(book);
});

// DELETE book by id
bookRouter.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid book ID' });
    }
    
    const bookIndex = books.findIndex(book => book.id === id);
    if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found' });
    }
    
    books.splice(bookIndex, 1);
    res.status(204).send();
});

// POST create new book
bookRouter.post('/', (req, res) => {
    const { title, author } = req.body;
    
    if (!title || !author) {
        return res.status(400).json({ error: 'Title and author are required' });
    }
    
    const newBook = { id: books.length + 1, title, author };
    books.push(newBook);
    res.status(201).json(newBook);
});


export default bookRouter;