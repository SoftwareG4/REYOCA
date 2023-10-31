ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root@123';

CREATE DATABASE  IF NOT EXISTS `Reyoca_DB`;
USE Reyoca_DB;


DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `_ID` INT NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL DEFAULT '',
  `email` varchar(50) NOT NULL,
  `password` varchar(20) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `role` varchar(50) NOT NULL,
  `government_id` varchar(50),
  `DL_number` varchar(50),
  PRIMARY KEY (`_ID`)
);

INSERT INTO `user` (`first_name`, `last_name`, `email`, `password`, `phone`, `role`, `government_id`, `DL_number`) VALUES
('admin', '', 'admin@reyoca.com', 'admin@123', '123-456-7890', 'admin', NULL, NULL),
('John', 'Doe', 'john.doe@gmail.com', 'John@123', '123-456-7890', 'renter', '12345', NULL),
('Jane', 'Smith', 'jane.smith@gmail.com', 'Jane@123', '987-654-3210', 'rentee', NULL, 'DL67890'),
('Alice', 'Johnson', 'alice.j@gmail.com', 'Alice@123', '555-555-5555', 'renter', '54321', NULL),
('Bob', 'Brown', 'bob@gmail.com', 'Bob@123', '111-222-3333', 'renter', '11111', NULL),
('Carol', 'Davis', 'carol@gmail.com', 'Carol@123', '444-555-6666', 'rentee', NULL, 'DL22222'),
('David', 'Lee', 'david.lee@gmail.com', 'David@123', '777-888-9999', 'renter', '77777', NULL),
('Eve', 'Wilson', 'eve@gmail.com', 'Eve@123', '555-123-4567', 'renter', '44444', NULL),
('Frank', 'Adams', 'frank@gmail.com', 'Frank@123', '222-333-4444', 'rentee', NULL, 'DL88888'),
('Grace', 'Harris', 'grace@gmail.com', 'Grace@123', '123-987-6543', 'renter', '55555', NULL),
('Henry', 'Smith', 'henry@gmail.com', 'Henry@123', '111-111-1111', 'renter', '33333', NULL),
('Ivy', 'Martinez', 'ivy.m@gmail.com', 'Ivy@123', '777-123-4567', 'rentee', NULL, 'DL66666'),
('Jack', 'Hall', 'jack@gmail.com', 'Jack@123', '333-444-5555', 'renter', '44444', NULL),
('Kate', 'Jones', 'kate@gmail.com', 'Kate@123', '888-777-6666', 'renter', '99999', NULL),
('Liam', 'Miller', 'liam@gmail.com', 'Liam@123', '222-555-4444', 'rentee', NULL, 'DL33333'),
('Mia', 'Williams', 'mia.w@gmail.com', 'Mia@123', '555-888-7777', 'renter', '22222', NULL),
('Noah', 'Anderson', 'noah@gmail.com', 'Noah@123', '111-999-8888', 'renter', '77777', NULL),
('Olivia', 'White', 'olivia@gmail.com', 'Olivia@123', '999-555-4444', 'rentee', NULL, 'DL11111'),
('Peter', 'Martin', 'peter@gmail.com', 'Peter@123', '444-555-6666', 'renter', '44444', NULL),
('Quinn', 'Moore', 'quinn@gmail.com', 'Quinn@123', '555-123-4567', 'renter', '55555', NULL),
('Rachel', 'Thomas', 'rachel.t@gmail.com', 'Rachel@123', '222-333-4444', 'rentee', NULL, 'DL66666'),
('Samuel', 'Brown', 'sam@gmail.com', 'Samuel@123', '123-987-6543', 'renter', '77777', NULL),
('Tina', 'Clark', 'tina@gmail.com', 'Tina@123', '111-111-1111', 'renter', '33333', NULL),
('Uma', 'Garcia', 'uma@gmail.com', 'Uma@123', '555-555-5555', 'rentee', NULL, 'DL54321'),
('Victor', 'King', 'victor@gmail.com', 'Victor@123', '555-123-4567', 'renter', '67890', NULL),
('Walter', 'Young', 'walter@gmail.com', 'Walter@123', '987-654-3210', 'renter', '12345', NULL),
('Xavier', 'Brown', 'xavier@gmail.com', 'Xavier@123', '444-555-6666', 'rentee', NULL, 'DL44444'),
('Yara', 'Wright', 'yara@gmail.com', 'Yara@123', '777-888-9999', 'renter', '11111', NULL),
('Zane', 'Hill', 'zane@gmail.com', 'Zane@123', '555-123-4567', 'renter', '77777', NULL),
('Ava', 'Gonzalez', 'ava@gmail.com', 'Ava@123', '123-987-6543', 'rentee', NULL, 'DL33333'),
('Ben', 'Roberts', 'ben@gmail.com', 'Ben@123', '555-555-5555', 'renter', '44444', NULL),
('Charlie', 'Anderson', 'charlie@gmail.com', 'Charlie@123', '123-987-6543', 'renter', '55555', NULL),
('Daisy', 'Harris', 'daisy@gmail.com', 'Daisy@123', '444-555-6666', 'rentee', NULL, 'DL22222'),
('Eli', 'Jackson', 'eli@gmail.com', 'Eli@123', '555-123-4567', 'renter', '66666', NULL),
('Faye', 'Brown', 'faye@gmail.com', 'Faye@123', '555-123-4567', 'renter', '77777', NULL),
('Grace', 'Thomas', 'grace.t@gmail.com', 'Grace@123', '555-123-4567', 'rentee', NULL, 'DL11111'),
('Harry', 'Davis', 'harry.d@gmail.com', 'Harry@123', '555-123-4567', 'renter', '11111', NULL),
('Iris', 'Wright', 'iris.w@gmail.com', 'Iris@123', '555-123-4567', 'rentee', NULL, 'DL77777'),
('Jack', 'Brown', 'jack.b@gmail.com', 'Jack@123', '555-123-4567', 'renter', '12345', NULL),
('Kara', 'Clark', 'kara.c@gmail.com', 'Kara@123', '555-123-4567', 'renter', '33333', NULL),
('Leo', 'Moore', 'leo.m@gmail.com', 'Leo@123', '555-123-4567', 'rentee', NULL, 'DL54321'),
('Mia', 'Martin', 'mia.m@gmail.com', 'Mia@123', '555-123-4567', 'renter', '22222', NULL),
('Nora', 'Garcia', 'nora.g@gmail.com', 'Nora@123', '555-123-4567', 'rentee', NULL, 'DL55555'),
('Oliver', 'Wilson', 'oliver.w@gmail.com', 'Oliver@123', '555-123-4567', 'renter', '55555', NULL),
('Penelope', 'Hill', 'penelope.h@gmail.com', 'Penelope@123', '555-123-4567', 'renter', '44444', NULL),
('Quinn', 'Roberts', 'quinn.r@gmail.com', 'Quinn@123', '555-123-4567', 'rentee', NULL, 'DL66666'),
('Ryan', 'Smith', 'ryan.s@gmail.com', 'Ryan@123', '555-123-4567', 'renter', '12345', NULL),
('Sophia', 'Lee', 'sophia.l@gmail.com', 'Sophia@123', '555-123-4567', 'renter', '33333', NULL),
('Theo', 'Anderson', 'theo.a@gmail.com', 'Theo@123', '555-123-4567', 'rentee', NULL, 'DL44444'),
('Violet', 'Jackson', 'violet.j@gmail.com', 'Violet@123', '555-123-4567', 'renter', '66666', NULL),
('Will', 'Thomas', 'will.t@gmail.com', 'Will@123', '555-123-4567', 'rentee', NULL, 'DL55555');

SELECT * FROM user