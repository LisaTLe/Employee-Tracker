const connection = require("./config/connection");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");
const { query } = require("express");

// const query = require("./config/connection");

//connect db

// const connection = mysql.createConnection({
//   host: "localhost",
//   port: 3306,
//   user: "root",
//   password: "process.env.DB_PASSWORD",
//   database: "employee_db",
// });

// connection.connect((err) => {
//   if (err) throw err;
//   promptUser();
// });

//prompt choices for user
const promptUser = () => {
  inquirer
    .prompt([
      {
        name: "choices",
        type: "list",
        message: "Please choose a option to continue:",
        choices: [
          "View All Employees",
          "View All Departments",
          "View All Roles",
          "Add Department",
          "Add Role",
          "Add Employee",
          "Remove Employee",
          "Remove Role",
          "Remove Department",
          "Update Employee",
          "Finish",
        ],
      },
    ])
    .then(function (answers) {
      const { choices } = answers;
      if (choices === "View All Employees") {
        viewAllEmployees();
      }
      if (choices === "View All Departments") {
        getAllDepartments();
        viewAllDepartments();
      }
      if (choices === "View All Roles") {
        viewAllRoles();
      }
      if (choices === "Add Department") {
        addDepartment();
      }
      if (choices === "Add Role") {
        addRole();
      }
      if (choices === "Add Employee") {
        addEmployee();
      }
      if (choices === "Remove Employee") {
        removeEmployee();
      }
      if (choices === "Remove Role") {
        removeRole();
      }
      if (choices === "Remove Department") {
        removeDepartment();
      }
      if (choices === "Update Employee") {
        updateEmployee();
      }
      if (choices === "Finish") {
        connection.end();
      }
    });
};

//view all employees
const viewAllEmployees = () => {
  console.log("Now viewing all employees");

  const sql = `SELECT employee.id, 
              employee.first_name, 
              employee.last_name, 
              role.title, 
              department.name AS department, 
              role.salary,
              FROM employee, role, department 
              WHERE department.id = role.department_id`;

  connection.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptUser();
  });
};

//view all departments
const getAllDepartments = async () => {
  console.log("Now viewing all departments");
  const department = await query("SELECT name, id FROM department");
  return department.map(({ name, id }) => {
    return {
      name,
      value: id,
    };
  });
};

const viewAllDepartments = () => {
  query("SELECT * FROM department", (err, res) => {
    if (err) {
      console.log(err);
    }
    console.table(res);
  });
};

//view all roles
const viewAllRoles = () => {
  console.log("Now viewing all roles");
  const sql = `SELECT role.title, 
              department.name AS department
              FROM role
              INNER JOIN department ON role.department_id = department.id`;
  connection.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    promptUser();
  });
};

//add department
const addDepartment = async () => {
  console.log("Now viewing all departments");
  const { department } = await inquirer.prompt([
    {
      type: "input",
      message: "What is the name of the department that you would like to add?",
      name: "department",
    },
  ]);
  await query("INSERT INTO department (name) VALUES (?)", department);
  // getAllDepartments();
  viewAllDepartments();
};

//add employee
const addEmployee = async () => {
  console.log("Now adding an new employee");
  const { firstName, lastName, empRole, empManager } = await inquirer.prompt([
    {
      message:
        "What is the first name of the employee that you would like to add?",
      name: "firstName",
    },
    {
      message:
        "What is the last name of the employee that you would like to add?",
      name: "lastName",
    },
    {
      message: "What is the role of the employee this employee?",
      name: "empRole",
    },
    {
      message: "Who is the manager that this employee is under?",
      name: "empManager",
    },
  ]);
  const sql =
    "INSERT INTO employee (first_name, last_name, emp_role, emp_manager) VALUES (?)";
  connection.query(
    sql,
    firstName,
    lastName,
    empRole,
    empManager,
    (err, res) => {
      if (err) console.log(err);
      console.log(res);
      promptUser();
    }
  );
};

//add role
const addRole = async () => {
  console.log("Now adding a new role");
  const { role } = await inquirer.prompt([
    {
      message: "What is the role that you would like to add?",
      name: "role",
    },
  ]);
  const sql = "INSERT INTO role (name) VALUES (?)";
  connection.query(sql, role, (err, res) => {
    if (err) console.log(err);
    console.log(res);
    promptUser();
  });
};

//remove department

//update employee

const updateEmployee = async () => {
  console.log("Now updating employee");
  const { employeeId, empRole } = await inquirer.prompt([
    {
      type: "input",
      message: "Which employee would you like to update?",
      name: "employeeId",
    },
    {
      type: "input",
      message: "Which role would you like to update the employee to?",
      name: "empRole",
    },
  ]);
  try {
    await query("UPDATE employees SET role_id = ? WHERE id = ?", [
      empRole,
      employeeId,
    ]);
  } catch (err) {
    console.log(err);
    promptUser();
  }
};

promptUser();
