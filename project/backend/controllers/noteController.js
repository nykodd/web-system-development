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
    const user_id = request.body.id_note_user;
    if (!user_id) {
        return response.status(400).json({ error: 'id_note_user is required' });
    }
    const newNote = await noteModel.createNote({
        ...result.data,
        id_note_user: Number(user_id),
        });

    response.status(201).json(newNote);
}

export async function updateNote(request, response) {
    const id = request.params.id;
    const result = noteSchema.safeParse(request.body);
    if (result.error) {
        return response.status(400).json(result.error.issues);
    }
    const updatedNote = await noteModel.updateNote(id, result.data);
    if (!updatedNote) {
        return response.status(404).json({ error: 'Note not found' });
    }
    response.json(updatedNote);
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