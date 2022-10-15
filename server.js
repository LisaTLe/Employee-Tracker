// const connection = require("./config/connection");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const table = require("console.table");
const { response } = require("express");
// const { query } = require("express");
require("dotenv").config();

// const query = require("./config/connection");

//connect db

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "process.env.DB_PASSWORD",
    database: "employee_db",
  },
  console.log("connected to database")
);

// connection.connect((err) => {
//   if (err) throw err;
//   promptUser();
// });

//prompt choices for user
function start() {
  inquirer
    .prompt([
      {
        message: " What would you like to do?",
        type: "list",
        choices: [
          "Add Department",
          "Add Role",
          "Add Employee",
          "View Departments",
          "View Roles",
          "View Employees",
          "Finish",
        ],
        name: "start",
      },
    ])
    .then((response) => {
      if (response.start === "Add Department") {
        return addDepartment();
      } else if (response.start === "Add Role") {
        return addRole();
      } else if (response.start === "Add Employee") {
        return addEmployee();
      } else if (response.start === "View Departments") {
        return viewAllDepartments();
      } else if (response.start === "View Roles") {
        return viewAllRoles();
      } else if (response.start === "View Employees") {
        return viewAllEmployees();
      } else {
        return finish();
      }
    });
}

start();

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
