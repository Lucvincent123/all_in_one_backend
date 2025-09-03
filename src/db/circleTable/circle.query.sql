-- name: create_circles_table
CREATE TABLE circles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL
);

-- name: drop_circles_table
DROP TABLE circles;

-- name: insert_circles_data
INSERT INTO circles (title) VALUES ($1) RETURNING id;

-- name: select_all_circles
SELECT * FROM circles;

-- name: delete_circle_by_id
