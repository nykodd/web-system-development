#! /usr/bin/env node
import pool from './pool.js';
const SQL = `
CREATE TABLE users (
id_user SERIAL PRIMARY KEY,
username varchar(255) NOT NULL UNIQUE,
password varchar(255) NOT NULL,
email varchar(255) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE status (
id_stat SERIAL PRIMARY KEY,
stat_name text NOT NULL
);


CREATE TABLE notes (
id_note SERIAL PRIMARY KEY,
content text NOT NULL,
important boolean,
id_note_stat INTEGER REFERENCES status(id_stat) ON DELETE SET NULL,
id_note_user INTEGER REFERENCES users(id_user) ON DELETE SET NULL
);


INSERT INTO status (stat_name)
VALUES
('To do'),
('In progress'),
('Done');

INSERT INTO users (username, password, email)
VALUES
('alice', 'password123', 'alice@example.com'),
('bob', 'password123', 'bob@example.com'),
('carol', 'password123', 'carol@example.com');

INSERT INTO notes (content, important, id_note_stat, id_note_user)
VALUES
('Buy milk', true, 1, 1),
('Prepare for presentation', true, 1, 2),
('Buy bread', false, 1, 3);
`;

async function main() {
    console.log('seeding...');
    await pool.query(SQL);
    console.log('done');
}
main();
