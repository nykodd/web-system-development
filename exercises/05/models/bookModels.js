import pool from '../db/pool.js';

async function getNotes() {
    try {
        const result = await pool.query('SELECT * FROM notes');
        return result.rows;
    } catch (error) {
        console.error('Database connection error:', error.message);
        console.error('Full error:', error);
        throw new Error(`Database error: ${error.message}`);
    }
}

async function getNoteById(id) {
    try {
        const result = await pool.query('SELECT * FROM notes WHERE id = $1', [id]);
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

// add method
// const result = await pool.query(
//     INSERT INTO notes (content, important) VALUES ('" + content + "', '" + important + "') RETURNING *
//     );

export default {
    getNotes, getNoteById, deleteNote
};