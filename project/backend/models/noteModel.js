import pool from '../db/pool.js';

async function getNotes() {
    try {
        const result = await pool.query(
            `SELECT
            notes.*,
            users.username,
            status.id_stat,
            status.stat_name
            FROM notes
            LEFT JOIN users
            ON notes.id_note_user = users.id_user
            LEFT JOIN status
            ON notes.id_note_stat = status.id_stat`
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
            users.username,
            status.id_stat,
            status.stat_name
            FROM notes
            LEFT JOIN users
            ON notes.id_note_user = users.id_user
            LEFT JOIN status
            ON notes.id_note_stat = status.id_stat
            WHERE notes.id_note = $1`,
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
            'INSERT INTO notes (content, important, id_note_stat, id_note_user) VALUES ($1, $2, $3, $4) RETURNING id_note',
            [note.content, note.important || false, note.id_note_stat || null, note.id_note_user || note.user_id]
        );
        // Fetch the full note with status and user info
        return await getNoteById(insertResult.rows[0].id_note);
    } catch (error) {
        console.error('Database error:', error.message);
        throw new Error(`Database error: ${error.message}`);
    }
}

async function updateNote(id, note) {
    try {
        await pool.query(
            `UPDATE notes 
            SET content = COALESCE($1, content),
                important = COALESCE($2, important),
                id_note_stat = COALESCE($3, id_note_stat)
            WHERE id_note = $4`,
            [note.content, note.important, note.id_note_stat, id]
        );
        // Fetch the full note with status and user info
        return await getNoteById(id);
    } catch (error) {
        console.error('Database error:', error.message);
        throw new Error(`Database error: ${error.message}`);
    }
}


export default {
    getNotes, getNoteById, deleteNote, createNote, updateNote
};