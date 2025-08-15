-- name: create_users_table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);


-- name: drop_users_table
DROP TABLE users;

-- name: insert_users_data
INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3);

-- name: select_all_users
SELECT * FROM users;

-- name: select_id_password_hash_by_email
SELECT id, password_hash FROM users WHERE email = $1;


