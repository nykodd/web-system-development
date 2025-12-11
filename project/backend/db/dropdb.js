#! /usr/bin/env node
import pool from './pool.js';

const SQL = `
DO $$ 
DECLARE 
    r RECORD;
BEGIN 
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP; 
END $$;
`;

async function main() {
    console.log('Dropping all tables...');
    await pool.query(SQL);
    console.log('All tables dropped successfully');
    await pool.end();
}

main().catch((err) => {
    console.error('Error dropping tables:', err);
    process.exit(1);
});

