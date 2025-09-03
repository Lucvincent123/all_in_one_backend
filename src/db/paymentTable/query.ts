export const create_payment_table = `
CREATE TABLE payments (
    userId   INT,
    expenseId INT,
    amount DECIMAL(12,2) NOT NULL CHECK (amount >= 0),
    PRIMARY KEY (userId, expenseId),
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (expenseId) REFERENCES expenses(id)
);
`;

export const drop_payment_table = `
DROP TABLE payments;
`;

export const insert_payment_data = `
INSERT INTO payments (userId, expenseId, amount) VALUES ($1, $2, $3);
`;

export const select_all_payments = `
SELECT * FROM payments;
`;

export const select_all_payments_by_expenseId = `
SELECT userId as id, u.username, u.email, p.amount
FROM payments as p, users as u
WHERE expenseId = $1
AND u.id = p.userId;
`;
