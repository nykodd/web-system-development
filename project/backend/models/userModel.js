import pool from '../db/pool.js';
async function getUsers() {
    try {
        const result = await pool.query('SELECT * FROM users');
        return result.rows;
    } catch (error) {
        console.error('Database connection error:', error.message);
        console.error('Full error:', error);
        throw new Error(`Database error: ${error.message}`);
    }
}
async function getUserById(id) {
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Database connection error:', error.message);
        throw new Error(`Database error: ${error.message}`);
    }
}
export default {
    getUsers,
    getUserById,
};
