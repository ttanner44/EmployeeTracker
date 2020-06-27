-- Drops the programming_db if it already exists --
DROP DATABASE IF EXISTS employeeTracker_db;

-- Created the DB "wizard_schools_db" (only works on local connections)
CREATE DATABASE employeeTracker_db;

-- Use the DB wizard_schools_db for all the rest of the script
USE employeeTracker_db;

-- Create the table "department"
CREATE TABLE department (
  id int AUTO_INCREMENT NOT NULL,
  name varchar(30),
  long_name varchar(30),
  PRIMARY KEY(id)
);

-- Create the table "role"
CREATE TABLE role (
  id int AUTO_INCREMENT NOT NULL,
  title varchar(30),
  salary decimal(7,2) default 0,
  depart_ID int references department(id),
  PRIMARY KEY(id)
);

-- Create the table "employee"
CREATE TABLE employee (
  id int AUTO_INCREMENT NOT NULL,
  first_name varchar(30),
  last_name varchar(30),
  role_id int references role(id),
  manager_id int references employee(id),
  PRIMARY KEY(id)
);