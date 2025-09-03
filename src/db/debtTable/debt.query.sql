-- name: create_debt_table
CREATE TABLE debts (
    userId   INT,
    expenseId INT,
    amount DECIMAL(12,2) NOT NULL CHECK (amount >= 0),
    PRIMARY KEY (userId, expenseId),
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (expenseId) REFERENCES expenses(id)
);

-- name: drop_debt_table
DROP TABLE debts;

-- name: insert_debt_data
INSERT INTO debts (userId, expenseId, amount) VALUES ($1, $2, $3);

-- name: select_all_debts
SELECT * FROM debts;

-- name: select_all_debts_by_expenseId
SELECT userId as id, u.username, u.email, d.amount
FROM debts as d, users as u
WHERE expenseId = $1
AND u.id = d.userId;

