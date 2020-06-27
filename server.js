const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

console.log("get db connection");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Orange1!",
  database: "employeeTracker_db"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  // Initial call of the function
  console.log("prompt user");
  prompt();
});

// Initial prompt "What type of employee?"
function promptUser() {
  return inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        'View All Employees',
        'View Employees by Department',
        'View All Roles',
        'View All Departments',
        'Add Employee',
        'Add Role',
        'Add Department',
        'Update Employee Role',
        'View Total Utlized Budet by Department',
        'All Done'
      ],
    },
  ]);
}
// Add Department
function promptAddDepartment() {
  return inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What is the departments's name?"
    },
    {
      type: "input",
      name: "longName",
      message: "What is the Department's Long Name?"
    },
  ]);
}

// Add Role
function promptAddRole(res) {
  return inquirer.prompt ([
      {
        type: "rawlist", 
        name: "depart_name",
        choices: function () {
          let deptArray = [];
          for (let i = 0; i < res.length; i++) 
            {deptArray.push(res[i].name);}
          return deptArray;
          },
        message: "Which department?"
      },
      { 
        type: "input", 
        name: "title", 
        message: "What is role title?" 
      },
      {
          type: "number", 
          name: "salary", 
          message: "What is the salary?" 
      }
  ]);
}

// // Add Employee
function promptAddEmployee(roles, employees) {
  return inquirer.prompt ([
      {
          type: "input",
          name: "first_name",
          message: "What is the employee's first name?"
        },
        {
          type: "input",
          name: "last_name",
          message: "What is the employee's last name?"
        },
        {
          type: "rawlist", 
          name: "role_title",
          choices: function () {
            let roleArray = [];
            for (let i = 0; i < roles.length; i++) 
              {roleArray.push(roles[i].title);}
            return roleArray;
            },
          message: "Which role?"
        },
        {
          type: "rawlist", 
          name: "mgr_name",
          choices: function () {
            let employeeArray = [];
            for (let i = 0; i < employees.length; i++) 
              {employeeArray.push(employees[i].last_name);}
            return employeeArray;
            },
          message: "Who's your manager"
        },
  ]);
}

// // Select Employee
function promptSelectEmployee(employees) {
  return inquirer.prompt ([
        {
          type: "rawlist", 
          name: "last_name",
          choices: function () {
            let employeeArray = [];
            for (let i = 0; i < employees.length; i++) 
              {employeeArray.push(employees[i].last_name);}
            return employeeArray;
            },
          message: "Which employee needs to be edited?"
        },
  ]);
}

// // Select Role
function promptSelectRole(roles) {
  return inquirer.prompt ([
        {
          type: "rawlist", 
          name: "title",
          choices: function () {
            let roleArray = [];
            for (let i = 0; i < roles.length; i++) 
              {roleArray.push(roles[i].title);}
            return roleArray;
            },
          message: "Select the revised role?"
        },
  ]);
}

// Main Function
function prompt() {

  // Prompt for initial 
  promptUser().then(function (action) {

    // Switch initiates the righ type questions depending upon employee type
    switch (action.action) {

      // Empployee Listing Report
      case "View All Employees":
        var query = "select employee.first_name, employee.last_name, role.title, department.name FROM Employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.depart_ID = department.id";
        connection.query(query, function (err, res) {if (err) throw err;
          let table = cTable.getTable(res);
          console.log(table);
          prompt();
        });
        break;

      // Empployee By Department Report
      case "View Employees by Department":
        var query = "SELECT department.name, role.title, employee.first_name, employee.last_name FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.depart_ID = department.id ORDER BY department.id";
        connection.query(query, function (err, res) {if (err) throw err;
          let table = cTable.getTable(res);
          console.log(table);
          prompt();
        });
      break;

      // Roles Listing Report
      case "View All Roles":
        var query = "SELECT role.title, department.name FROM role INNER JOIN department ON department.id = role.depart_id";
        connection.query(query, function (err, res) {if (err) throw err;
          let table = cTable.getTable(res);
          console.log(table);
          prompt();
        });
      break;

      // Department Listing Report     
      case "View All Departments":
        var query = "SELECT name, long_name FROM department";
        connection.query(query, function (err, res) {if (err) throw err;
          let table = cTable.getTable(res);
          console.log(table);
          prompt();
        });
      break;

      // // Add Employee      
      case "Add Employee": 
        
        var query1 = "SELECT * FROM role";
        connection.query (query1, function (err, roles) {            
            if (err) throw err;
            
            var query2 = "SELECT * FROM employee";      
            connection.query (query2, function (err, employees) {if (err) throw err;

                promptAddEmployee(roles, employees).then (function(addEmployeeAnswers) {              

                      var query3 = "SELECT id FROM role WHERE title = ?";
                      connection.query (query3, (addEmployeeAnswers.role_title), function (err, res3) {if (err) throw err;

                        var query4 = "SELECT id FROM employee WHERE last_name = ?";
                        connection.query (query4, (addEmployeeAnswers.mgr_name), function (err, res4) {if (err) throw err;

                            var query5 = "INSERT INTO employee SET ?";                  
                            connection.query (query5, {first_name: addEmployeeAnswers.first_name, last_name: addEmployeeAnswers.last_name, role_id: res3[0].id, manager_id: res4[0].id}, function (err) {if (err) throw err;
                            console.log("Employee added successfully");
                            prompt();
                            });
                        });                     
                    });
                });
            }); 
        });
      break;

      // Add Role      
      case "Add Role":
        var query = "SELECT * FROM department";
        connection.query (query, function (err, res1) {            
            if (err) throw err;
            
            promptAddRole(res1).then (function(addRoleAnswers) {              
                
                var query1 = "SELECT id FROM department WHERE name = ?";
                connection.query (query1, (addRoleAnswers.depart_name), function (err, res2) {if (err) throw err;
                    
                    var query2 = "INSERT INTO role SET ?";                  
                    connection.query (query2, {title: addRoleAnswers.title, salary: addRoleAnswers.salary, depart_id: res2[0].id}, function (err) {if (err) throw err;
                      console.log("Role added successfully");

                      prompt();
                    });
                });
            });                
        });
      break;

      // Add Department      
      case "Add Department":

        promptAddDepartment().then(function (addDeptAnswers) {

          var query = "INSERT INTO department SET ?";
          connection.query(query, {name: addDeptAnswers.name, long_name: addDeptAnswers.longName},
            function (err) {
              if (err) throw err;
              console.log("Department added succesfully");
              prompt();
            });
        });
      break;

      // Update Employee Role
      case "Update Employee Role":
                 
        var query1 = "SELECT * FROM employee";      
        connection.query (query1, function (err, employees) {if (err) throw err;
            
            promptSelectEmployee(employees).then(function (selectedEmployee) {
                  
                var query2 = "SELECT * FROM employee WHERE last_name = ?";
                connection.query (query2, (selectedEmployee.last_name), function (err, res2) {if (err) throw err;
                    
                    var query3 = "SELECT * FROM role";
                    connection.query (query3, function (err, roles) {if (err) throw err;
                        
                        promptSelectRole(roles).then(function (selectedRole) {                   
                            
                            var query4 = "SELECT id FROM role WHERE title = ?";
                            connection.query (query4, (selectedRole.title), function (err, res4) {if (err) throw err;
                                
                                var query = "UPDATE employee SET role_id = ? WHERE id = ?";
                                connection.query(query, [{role_id: res4[0].id}, {id: res2[0].id}], function (err) {if (err) throw err;                  
                                console.log("Department added succesfully");
                                prompt();
                                });
                            });
                        });
                    });
                });
            });
        });

      break;
      
      // View Total Utlized Budet by Department     
      case "View Total Utlized Budet by Department":
        var query = "SELECT sum(role.salary), department.long_name  FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.depart_ID = department.id GROUP BY department.long_name;";
        connection.query(query, function (err, res) {if (err) throw err;
          let table = cTable.getTable(res);
          console.log(table);
          prompt();
        });
      break;
      
      // All done with employees; initiate HTML call and write file.   
      default:
        console.log("All Done");
    }
  });
}
