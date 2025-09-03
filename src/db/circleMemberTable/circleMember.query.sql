-- name: create_members_table
CREATE TABLE circleMembers (
    userId   INT,
    circleId INT,
    balance  DECIMAL(12,2) DEFAULT 0,
    PRIMARY KEY (userId, circleId),
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (circleId) REFERENCES circles(id)
);

-- name: drop_members_table
DROP TABLE circleMembers;

-- name: insert_members_data
INSERT INTO circleMembers (userId, circleId) VALUES ($1, $2);

-- name: select_all_members
SELECT * FROM circleMembers;

-- name: select_all_circles
SELECT circleId, title, balance FROM circles, circlemembers
WHERE id = circleid 
AND userId = $1
ORDER BY id DESC;

-- name: select_all_members_of_circle
SELECT userId, username, email, balance FROM circleMembers AS c, users AS u
WHERE c.userId = u.id
AND c.circleId = $1;

-- name: select_all_members_not_in_circle
SELECT u.id AS userId, u.username, u.email
FROM users AS u
WHERE NOT EXISTS (
    SELECT 1 
    FROM circleMembers AS c
    WHERE c.userId = u.id
      AND c.circleId = $1
);

-- name: update_member_balance
UPDATE circleMembers
SET balance = balance + $1
WHERE userId = $2 AND circleId = $3;

