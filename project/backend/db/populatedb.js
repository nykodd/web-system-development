#! /usr/bin/env node
import pool from './pool.js';
const SQL = `
CREATE TABLE users (
id SERIAL PRIMARY KEY,
username varchar(255) NOT NULL UNIQUE,
password varchar(255) NOT NULL,
email varchar(255) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE notes (
id SERIAL PRIMARY KEY,
content text NOT NULL,
important boolean,
user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
);
INSERT INTO users (username, password, email)
VALUES
('alice', 'password123', 'alice@example.com'),
('bob', 'password123', 'bob@example.com'),
('carol', 'password123', 'carol@example.com');
INSERT INTO notes (content, important, user_id)
VALUES
('Buy milk', true, 1),
('Prepare for presentation', true, 2),
('Buy bread', false, 3);

`;

async function main() {
    console.log('seeding...');
    await pool.query(SQL);
    console.log('done');
}
main();
