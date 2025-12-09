import pool from '../db/pool.js';

async function getNotes() {
    try {
        const result = await pool.query(
            `SELECT
            notes.*,
            users.username
            FROM notes
            LEFT JOIN users
            ON notes.user_id = users.id`
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
            ON notes.user_id = users.id WHERE notes.id = $1`,
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
        const result = await pool.query('DELETE FROM notes WHERE id = $1', [id]);
        return result.rowCount > 0;
    } catch (error) {
        console.error('Database error:', error.message);
        throw new Error(`Database error: ${error.message}`);
    }
}

async function createNote(note) {
    try {
        const insertResult = await pool.query(
            'INSERT INTO notes (content, important, user_id) VALUES ($1, $2, $3) RETURNING id, content, important, user_id',
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