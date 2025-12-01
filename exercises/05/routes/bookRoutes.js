import { Router } from 'express';

let books = [
    { id: 1, title: 'Book 1', author: 'Author 1' },
    { id: 2, title: 'Book 2', author: 'Author 2' },
    { id: 3, title: 'Book 3', author: 'Author 3' },
];

const bookRouter = Router();
bookRouter.get('/', (req, res) => res.json(books));

bookRouter.get('/books/:bookId', (request, response) => {
    const id = request.params.id
    const book = books.find(book => book.id === id);
    if (book) {
        response.json(book);
    } else {
        response.status(404).json({ error: 'Book not found' });
    }
});

bookRouter.get('/', (req, res) => {
    res.json(books);
});
bookRouter.get('/:id', (req, res) => {
    const { id } = req.params;
    res.json(books.find(book => book.id === parseInt(id)));
});
bookRouter.delete('/:id', (req, res) => {
    const { id } = req.params;
    books = books.filter(book => book.id !== parseInt(id));
    res.json(books);
});
bookRouter.post('/', (req, res) => {
    const { title, author } = req.body;
    const newBook = { id: books.length + 1, title, author };
    books.push(newBook);
    res.json(newBook);
});

bookRouter.put('/:id', (req, res) => {
    res.json(books.find(book => book.id === parseInt(id)));
    const { id } = req.params;
});


export default bookRouter;