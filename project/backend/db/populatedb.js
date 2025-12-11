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
stat_name text NOT NULL,
color varchar(7) NOT NULL DEFAULT '#cccccc',
priority INTEGER
);

-- Function to auto-assign priority
CREATE OR REPLACE FUNCTION assign_status_priority()
RETURNS TRIGGER AS $$
BEGIN
    -- If priority is NULL or 0, assign the next available priority
    IF NEW.priority IS NULL OR NEW.priority = 0 THEN
        SELECT COALESCE(MAX(priority), 1) + 1 INTO NEW.priority FROM status;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-assign priority before insert
CREATE TRIGGER status_priority_trigger
    BEFORE INSERT ON status
    FOR EACH ROW
    EXECUTE FUNCTION assign_status_priority();


CREATE TABLE notes (
id_note SERIAL PRIMARY KEY,
content text NOT NULL,
important boolean,
id_note_stat INTEGER REFERENCES status(id_stat) ON DELETE SET NULL,
id_note_user INTEGER REFERENCES users(id_user) ON DELETE SET NULL
);


INSERT INTO status (stat_name, color, priority)
VALUES
('To do', '#eb5a46', 1),
('In progress', '#f2d600', 2),
('Done', '#61bd4f', 3);

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
