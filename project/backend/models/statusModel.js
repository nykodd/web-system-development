import pool from '../db/pool.js';

async function getStatuses() {
    try {
        const result = await pool.query('SELECT * FROM status');
        return result.rows;
    } catch (error) {
        console.error('Database connection error:', error.message);
        console.error('Full error:', error);
        throw new Error(`Database error: ${error.message}`);
    }
}
async function getStatusById(id) {
    try {
        const result = await pool.query('SELECT * FROM status WHERE id_stat = $1', [id]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Database connection error:', error.message);
        throw new Error(`Database error: ${error.message}`);
    }
}
export default {
    getStatuses,
    getStatusById,
};
