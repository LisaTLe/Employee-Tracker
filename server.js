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
function addDepartment() {
  inquirer
    .prompt([
      {
        message: "What department would you like to add?",
        type: "input",
        name: "department",
      },
    ])
    .then((response) => {
      const newDepartment = [response.department];
      db.query(
        "INSERT INTO departments (department_name) VALUES (?)",
        newDepartment,
        (err, result) => {
          if (err) {
            throw err;
            return;
          }
          console.log("New department has been added!");
          return start();
        }
      );
    });
}

//add employee
function addEmployee() {
  inquirer
    .prompt([
      {
        message: "Please enter the employee's ID number:",
        type: "input",
        name: "emp_id",
      },
      {
        message: "What is the first name of the new employee",
        type: "input",
        name: "emp_firstName",
      },
      {
        message: "What is the last name of the new employee",
        type: "input",
        name: "emp_lastName",
      },
      {
        message: "What is the role of the new employee?",
        type: "input",
        name: "emp_role",
      },
    ])
    .then((response) => {
      const newEmployee = [
        response.emp_id,
        response.emp_firstName,
        response.emp_lastName,
        response.emp_role,
      ];
      db.query(
        "INSERT INTO employee (id, first_name, last_name, role_id) VALUES (?,?,?,?)",
        newEmployee,
        (err, result) => {
          if (err) {
            throw err;
            return;
          }
          console.log("New employee has been added!");
          return start();
        }
      );
    });
}

//add role
function addRole() {
  inquirer
    .prompt([
      {
        message: "What is the title of this role?",
        type: "input",
        name: "role_name",
      },
      {
        message: "What is the salary of this role?",
        type: "input",
        name: "role_salary",
      },
      {
        message: "What department does this role belong to?",
        type: "input",
        name: "role_dept",
      },
    ])
    .then((response) => {
      const newRole = [
        response.role_name,
        response.role_salary,
        response.role_dept,
      ];
      db.query(
        "INSERT INTO roles (title, salary, department) VALUES (?,?,?)",
        newRole,
        (err, result) => {
          if (err) throw err;
          return start();
        }
      );
    });
}

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
