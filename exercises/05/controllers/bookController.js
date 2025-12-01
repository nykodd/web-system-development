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
    const newNote = await noteModel.createNote(result.data);
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
    const notes = await noteModel.getNotes();
    response.json(notes);
}

export async function getNoteById(request, response) {
    const notes = await noteModel.getNotes();
    response.json(notes);
}