-- Inserted a set of records into the department
INSERT INTO department (name, long_name)
VALUES ("MN117", "Sport Clips of Lake Calhoun");
INSERT INTO department (name, long_name) 
VALUES ("MN129", "Sport Clips of Crystal");
INSERT INTO department (name, long_name)
VALUES ("MN140", "Sport Clips of South MPLS");
INSERT INTO department (name, long_name)
VALUES ("TannerCo", "Sport Clips of South MPLS");

-- Inserted a set of records into the role table
INSERT INTO role (title, salary, depart_id)
VALUES ("Manager MN117", 72000, 1);
INSERT INTO role (title, salary, depart_id)
VALUES ("Asst Manage MN117", 50000, 1);
INSERT INTO role (title, salary, depart_id)
VALUES ("Stylist MN117", 40000, 1);
INSERT INTO role (title, salary, depart_id)
VALUES ("Manager MN129", 68000, 2);
INSERT INTO role (title, salary, depart_id)
VALUES ("Asst Manager MN129", 45000, 2);
INSERT INTO role (title, salary, depart_id)
VALUES ("Stylist MN129", 38000, 2);
INSERT INTO role (title, salary, depart_id)
VALUES ("Manager MN140", 75000, 3);
INSERT INTO role (title, salary, depart_id)
VALUES ("Asst Manager MN140", 52000, 3);
INSERT INTO role (title, salary, depart_id)
VALUES ("Stylist MN140", 42000, 3);
INSERT INTO role (title, salary, depart_id)
VALUES ("Owner", 0, 4);
INSERT INTO role (title, salary, depart_id)
VALUES ("Area Manager", 80000, 4);
INSERT INTO role (title, salary, depart_id)
VALUES ("Area Coach", 75000, 4);

-- Inserted a set of records into the employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Tim", "Tanner" , 10, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Rhianna", "Flores" , 7, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Cindy", "Kintner" , 1, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Kayla", "Volk" , 4, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Lauren", "Tourville" , 9, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Feather", "Hicks" , 6, 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Kim", "Boyd" , 3, 3);


select * from employee;
select * from role;
select * from department