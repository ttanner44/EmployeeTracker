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
// function promptAddEmployee() {
//   return inquirer.prompt ([
//       {
//           type: "input",
//           name: "first_name",
//           message: "What is the employee's first name?"
//         },
//         {
//           type: "input",
//           name: "last ",
//           message: "What is the employee's last name?"
//         },
//         {
//           type: "number",
//           name: "dept",
//           message: "What department?"
//         },
//         {
//           type: "number",
//           name: "role",
//           message: "Which role?"
//         },
//   ]);
// }

// Main Function
function prompt() {

  // Prompt for initial 
  promptUser().then(function (action) {

    // Switch initiates the righ type questions depending upon employee type
    switch (action.action) {

      // Empployee Listing Report
      case "View All Employees":
        connection.query("SELECT * FROM employee", function (err, res) {
          if (err) throw err;
          let table = cTable.getTable(res);
          console.log(table);
          prompt();
        });
        break;

      // Empployee By Department Report
      case "View Employees by Department":
        connection.query(
          "SELECT employee.first_name, employee.last_name, role.title, department.long_name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.depart_ID = department.id", function (err, res) {
            if (err) throw err;
            let table = cTable.getTable(res);
            console.log(table);
            prompt();
          });
        break;

      // Roles Listing Report
      case "View All Roles":
        connection.query("SELECT * FROM role", function (err, res) {
          if (err) throw err;
          let table = cTable.getTable(res);
          console.log(table);
          prompt();
        });
        break;

      // Department Listing Report     
      case "View All Departments":
        connection.query("SELECT * FROM department", function (err, res) {
          if (err) throw err;
          let table = cTable.getTable(res);
          console.log(table);
          prompt();
        });
        break;

      // // Add Employee      
      // case "View All Departments": 
      // console.log("view All Depts");
      // connection.query("SELECT * FROM department", function(err, res) {
      //   if (err) throw err;
      //   console.log(res);
      //   let table = cTable.getTable(res);
      //   console.log(table);
      //   prompt(); 
      // });
      // break;

      // Add Role      
      case "Add Role":
        connection.query
          ("SELECT * FROM department", function (err, res) {            
            if (err) throw err;


            promptAddRole(res).then (function(addRoleAnswers) {
              
                // get depart ID from record with the name
              
                connection.query("SELECT id FROM department WHERE name ?",
                  [{depart_name: addRoleAnswers.depart_name}],
                  function (err, res) {if (err) throw err;

                  let chosenDeptID = "";

                  for (let i=0; i<res.length; i++) {
                    if (addRoleAnswers.depart_name = deptList[i].name) {
                      chosenDeptID = deptList[i].id;
                    }
                  }

                  console.log(chosenDeptID);

                  connection.query 
                  ("INSERT INTO role SET ?",
                    [
                      {
                        title: addRoleAnswers.title,
                        salary: addRoleAnswers.salary,
                        depart_id: chosenDeptID
                      }
                    ],
                      
                    function (err) 
                    {
                      if (err) throw err;
                      console.log("Role added successfully");
                      prompt();
                    }
                  );
          
              });

            });
                
          });
          
          break;

        // Add Department      
        case "Add Department":
          promptAddDepartment().then(function (addDeptAnswers) {
            connection.query("INSERT INTO department SET ?",
              [
                {
                  name: addDeptAnswers.name,
                  long_name: addDeptAnswers.longName
                }
              ],
              function (err) {
                if (err) throw err;
                console.log("Department Added");
              });
            prompt();
          });
          break;

        // All done with employees; initiate HTML call and write file.   
        default:
          console.log("All Done");
    }
  });
}
