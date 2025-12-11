import { Router } from 'express';
import { getNotes, getNoteById, createNote, deleteNote, updateNote } from '../controllers/noteController.js';

const noteRouter = Router();
noteRouter.get('/', getNotes);
noteRouter.get('/:id', getNoteById);
noteRouter.post('/', createNote);
noteRouter.put('/:id', updateNote);
noteRouter.delete('/:id', deleteNote)

export default noteRouter;
