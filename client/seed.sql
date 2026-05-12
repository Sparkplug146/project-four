-- ============================
-- DevDen Forum - seed.sql
-- ============================

USE devden_forum;

-- ----------------------------
-- DEMO USERS
-- ----------------------------
-- IMPORTANT:
-- These password_hash values are placeholders.
-- Demo users will NOT be able to login unless created through Register page.
INSERT INTO users (username, password_hash) VALUES
("demoUser", "fakehash"),
("reactFan", "fakehash456"),
("nodeNinja", "fakehash789");

-- ----------------------------
-- DEMO QUESTIONS
-- ----------------------------
-- user_id 1 = demoUser
-- category_id: 1=JavaScript, 2=React, 3=Node.js, 4=SQL, 5=HTML/CSS
INSERT INTO questions (user_id, category_id, title, body) VALUES
(1, 1, "What is the difference between let and const?",
 "I am confused about when to use let vs const."),
(1, 2, "How does useEffect work?",
 "When does useEffect run and why?"),
(2, 2, "What is the difference between props and state?",
 "I keep mixing them up. Can someone explain simply?"),
(3, 3, "What is middleware in Express?",
 "I see middleware in Express apps but I don’t understand what it does."),
(1, 4, "What is the difference between INNER JOIN and LEFT JOIN?",
 "I’m confused about when to use each join type.");

-- ----------------------------
-- DEMO ANSWERS
-- ----------------------------
-- Question IDs match the insert order above (1-5)
INSERT INTO answers (question_id, user_id, body) VALUES
(1, 1, "Use const by default. Use let only if you need to reassign the variable."),
(1, 3, "const prevents reassignment but objects inside can still be mutated."),
(2, 2, "useEffect runs after render, and it can re-run when dependencies change."),
(3, 2, "Props are passed into a component. State is managed inside a component."),
(4, 3, "Middleware is a function that runs between the request and the response."),
(5, 1, "INNER JOIN returns matching rows. LEFT JOIN returns all left rows even if no match.");

-- Done
SELECT * FROM users;
SELECT * FROM questions;
SELECT * FROM answers;