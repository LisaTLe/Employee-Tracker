const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

const promptUser = () => {
  inquirer.prompt([
    {
      name: "choice",
      type: "list",
      message: "Please choose a category:",
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
    }.then((answers) => {
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
    }),
  ]);
};
