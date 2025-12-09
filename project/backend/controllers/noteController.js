import db from '../db.js';
import noteModel from '../models/noteModel.js';
import { noteSchema } from '../db/noteSchema.js';

export async function getNotes(request, response) {
    const notes = await noteModel.getNotes();
    response.json(notes);
}

export async function createNote(request, response) {
    const result = noteSchema.safeParse(request.body);
    if (result.error) {
        return response.status(400).json(result.error.issues);
    }
    const user_id = request.body.user_id;
    if (!user_id) {
        return response.status(400).json({ error: 'user_id is required' });
    }
    const newNote = await noteModel.createNote({
        ...result.data,
        user_id: Number(user_id),
        });

    response.status(201).json(newNote);
}

export async function updateNote(request, response) {
    const id = request.params.id;
    const result = noteSchema.safeParse(request.body);
    if (result.error) {
        return response.status(400).json(result.error.issues);
    }
    const note = await noteModel.getNoteById(id);
    if (note) {
        const updatedNote = {
            id: note.id,
            content: result.content,
            important: result.important,
        };
        await db.updateNote(id, updatedNote);
        response.json(updatedNote);
    }
}


export async function deleteNote(request, response) {
    const id = request.params.id;
    const deleted = await noteModel.deleteNote(id);
    if (!deleted) {
        return response.status(404).json({ error: 'Note not found' });
    }
    response.status(204).send();
}

export async function getNoteById(request, response) {
    const id = request.params.id;
    const note = await noteModel.getNoteById(id);
    if (!note) {
        return response.status(404).json({ error: 'Note not found' });
    }
    response.json(note);
}