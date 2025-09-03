-- name: create_repayment_table
CREATE TABLE repayments (
    id SERIAL PRIMARY KEY,
    sender   INT,
    receiver INT,
    circle_id INT,
    amount DECIMAL(12,2) NOT NULL CHECK (amount >= 0),
    repayment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    title VARCHAR(255) NOT NULL,
    FOREIGN KEY (sender) REFERENCES users(id),
    FOREIGN KEY (receiver) REFERENCES users(id),
    FOREIGN KEY (circle_id) REFERENCES circles(id)
);

-- name: drop_repayment_table
DROP TABLE repayments;

-- name: insert_repayment_data
INSERT INTO repayments (sender, receiver, circle_id, amount, repayment_date, title) VALUES ($1, $2, $3, $4, $5, $6);

-- name: select_all_repayments
SELECT * FROM repayments;

-- name: select_repayments_by_circle_id
SELECT r.id AS repayment_id, circle_id, amount, repayment_date, title, r.sender AS sender_id, u1.username AS sender_username, u1.email AS sender_email, r.receiver AS receiver_id, u2.username AS receiver_username, u2.email AS receiver_email 
FROM repayments AS r, users AS u1 , users AS u2
WHERE r.circle_id = $1 
AND r.sender = u1.id 
AND r.receiver = u2.id;