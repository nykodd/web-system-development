import pool from '../db/pool.js';

async function getNotes() {
    try {
        const result = await pool.query(
            `SELECT
            notes.*,
            users.username
            FROM notes
            LEFT JOIN users
            ON notes.id_note_user = users.id_user`
        );
        return result.rows;
    } catch (error) {
        console.error('Database connection error:', error.message);
        console.error('Full error:', error);
        throw new Error(`Database error: ${error.message}`);
    }
}

async function getNoteById(id) {
    try {
        const result = await pool.query(
            `SELECT 
            notes.*,
            users.username
            FROM notes
            LEFT JOIN users
            ON notes.id_note_user = users.id_user WHERE notes.id_note = $1`,
            [id]
        );

        return result.rows[0] || null;
    } catch (error) {
        console.error('Database error:', error.message);
        throw new Error(`Database error: ${error.message}`);
    }
}

async function deleteNote(id) {
    try {
        const result = await pool.query('DELETE FROM notes WHERE id_note = $1', [id]);
        return result.rowCount > 0;
    } catch (error) {
        console.error('Database error:', error.message);
        throw new Error(`Database error: ${error.message}`);
    }
}

async function createNote(note) {
    try {
        const insertResult = await pool.query(
            'INSERT INTO notes (content, important, id_note_stat, id_note_user) VALUES ($1, $2, $3, $4) RETURNING id_note, content, important, id_note_stat, id_note_user',
            [note.content, note.important, note.user_id]
        );
        return insertResult.rows[0];
    } catch (error) {
        console.error('Database error:', error.message);
        throw new Error(`Database error: ${error.message}`);
    }
}


export default {
    getNotes, getNoteById, deleteNote, createNote
};