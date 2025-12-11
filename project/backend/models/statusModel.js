import pool from '../db/pool.js';

async function getStatuses() {
    try {
        const result = await pool.query('SELECT * FROM status ORDER BY priority ASC');
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

async function createStatus(status) {
    try {
        // Priority is auto-assigned by database trigger
        const result = await pool.query(
            'INSERT INTO status (stat_name, color) VALUES ($1, $2) RETURNING *',
            [
                status.stat_name, 
                status.color || '#cccccc'
            ]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Database error:', error.message);
        throw new Error(`Database error: ${error.message}`);
    }
}

async function updateStatus(id, status) {
    try {
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');
            
            // Get current status
            const currentResult = await client.query('SELECT * FROM status WHERE id_stat = $1', [id]);
            if (currentResult.rows.length === 0) {
                await client.query('ROLLBACK');
                return null;
            }
            
            const currentStatus = currentResult.rows[0];
            const newPriority = status.priority !== undefined ? status.priority : currentStatus.priority;
            const oldPriority = currentStatus.priority;
            
            // If priority is being changed, we need to shift other statuses
            if (newPriority !== oldPriority) {
                if (newPriority > oldPriority) {
                    // Moving down: shift statuses between old and new priority up by 1
                    await client.query(
                        'UPDATE status SET priority = priority - 1 WHERE priority > $1 AND priority <= $2 AND id_stat != $3',
                        [oldPriority, newPriority, id]
                    );
                } else {
                    // Moving up: shift statuses between new and old priority down by 1
                    await client.query(
                        'UPDATE status SET priority = priority + 1 WHERE priority >= $1 AND priority < $2 AND id_stat != $3',
                        [newPriority, oldPriority, id]
                    );
                }
            }
            
            // Update the status
            const updateResult = await client.query(
                `UPDATE status 
                SET stat_name = COALESCE($1, stat_name),
                    color = COALESCE($2, color),
                    priority = $3
                WHERE id_stat = $4
                RETURNING *`,
                [status.stat_name, status.color, newPriority, id]
            );
            
            await client.query('COMMIT');
            return updateResult.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Database error:', error.message);
        throw new Error(`Database error: ${error.message}`);
    }
}

async function deleteStatus(id) {
    try {
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');
            
            // Get the priority of the status being deleted
            const statusResult = await client.query('SELECT priority FROM status WHERE id_stat = $1', [id]);
            if (statusResult.rows.length === 0) {
                await client.query('ROLLBACK');
                return false;
            }
            
            const deletedPriority = statusResult.rows[0].priority;
            
            // Delete the status
            await client.query('DELETE FROM status WHERE id_stat = $1', [id]);
            
            // Shift all statuses with higher priority down by 1
            await client.query(
                'UPDATE status SET priority = priority - 1 WHERE priority > $1',
                [deletedPriority]
            );
            
            await client.query('COMMIT');
            return true;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Database error:', error.message);
        throw new Error(`Database error: ${error.message}`);
    }
}

export default {
    getStatuses,
    getStatusById,
    createStatus,
    updateStatus,
    deleteStatus,
};
