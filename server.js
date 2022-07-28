const inquirer = require("inquirer");
const mysql = require("mysql2");
// const cTable = require("console.table");
const connection = require("./config/connection");
const query = require("./config/connection");

//prompt choices for user
const promptUser = () => {
  inquirer.prompt([
    {
      name: "choice",
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
    }.then(function (answers) {
      const { choices } = answers;
      if (choices === "View All Employees") {
        viewAllEmployees();
      }
      if (choices === "View All Departments") {
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
        finish();
      }
    }),
  ]);
};

//view all employees
const viewAllEmployees = async () => {
  console.log("Now viewing all employees");
  const { employee } = await inquirer.prompt([
    {
      message: "What is the name of the employee?",
      name: "employee",
    },
  ]);
  const sql = "INSERT INTO employee (name) VALUES (?)";
  connection.query(sql, employee, (err, res) => {
    if (err) console.log(err);
    console.log(res);
  });
};

//view all departments
const viewAllDepartments = async () => {
  console.log("Now viewing all departments");
  const { department } = await inquirer.prompt([
    {
      message: "What is the department name?",
      name: "department",
    },
  ]);
  const sql = "INSERT INTO department (name) VALUES (?)";
  connection.query(sql, department, (err, res) => {
    if (err) console.log(err);
    console.log(res);
  });
};

//view all roles
const viewAllRoles = async () => {
  console.log("Now viewing all roles");
  const { role } = await inquirer.prompt([
    {
      message: "What is the role of this employee?",
      name: "role",
    },
  ]);
  const sql = "INSERT INTO role (name) VALUES (?)";
  connection.query(sql, role, (err, res) => {
    if (err) console.log(err);
    console.log(res);
  });
};

//add department
const addDepartment = async () => {
  console.log("Now viewing all departments");
  const { department } = await inquirer.prompt([
    {
      message: "What is the name of the department that you would like to add?",
      name: "department",
    },
  ]);
  const sql = "INSERT INTO department (name) VALUES (?)";
  connection.query(sql, department, (err, res) => {
    if (err) console.log(err);
    console.log(res);
  });
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
  });
};

//remove department

//update employee
const employeeChoices = async () => {
  const manager = await query(
    "SELECT first_name, last_name, id FROM employees"
  );
  return manager.map((manager) => {
    return {
      name: `${manager.first_name} ${manager.last_name}`,
      value: manager.id,
    };
  });
};

const updateEmployee = async () => {
  console.log("Now updating employee");
  const { employeeId, empRole } = await inquirer.prompt([
    {
      type: "list",
      message: "Which employee would you like to update?",
      name: "employeeId",
      choices: await employeeChoices(),
    },
  ]);
  try {
    await query("UPDATE employees SET role_id = ? WHERE id = ?", [
      empRole,
      employeeId,
    ]);
  } catch (err) {
    console.log(err);
  }
};

promptUser();
