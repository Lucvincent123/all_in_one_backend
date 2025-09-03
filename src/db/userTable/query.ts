export const create_users_table = `
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);
`;

export const drop_users_table = `
DROP TABLE users;
`;

export const insert_users_data = `
INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3);
`;

export const select_all_users = `
SELECT * FROM users;
`;

export const select_id_password_hash_by_email = `
SELECT id, password_hash FROM users WHERE email = $1;
`;

export const select_id_by_email = `
SELECT id FROM users WHERE email = $1;
`;

export const update_password_by_id = `
UPDATE users SET password_hash = $1 WHERE id = $2;
`;

export const select_username_email_by_id = `
SELECT username, email FROM users WHERE id = $1;
`;
