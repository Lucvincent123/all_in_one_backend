export const create_expense_table = `
CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    circle_id INT NOT NULL,
    amount DECIMAL(12,2) NOT NULL CHECK (amount >= 0),
    title VARCHAR(255) NOT NULL,
    expense_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (circle_id) REFERENCES circles(id) ON DELETE CASCADE
);
`;

export const drop_expense_table = `
DROP TABLE expenses;
`;

export const insert_expense_data = `
INSERT INTO expenses (circle_id, amount, title, expense_date) VALUES ($1, $2, $3, $4) 
RETURNING id;
`;

export const select_all_expenses = `
SELECT * FROM expenses;
`;

export const select_all_expenses_by_circle_id = `
SELECT * FROM expenses 
WHERE circle_id = $1;
`;
