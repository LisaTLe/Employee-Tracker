INSERT INTO departments (name)
    VALUES
    ('Sales'),
    ('Engineer'),
    ('Legal'),
    ('Finance');

INSERT INTO role ( title, salary, department_id)
    VALUES
    ("Sales Lead", 80000, 1),
    ("Engineer", 95000, 2),
    ("Lawyer", 125000, 3),
    ("Accountant", 70000, 4);

INSERT INTO employee (first_name, last_name, emp_role, emp_manager)
    VALUES
    ("Patrick", "Mott", 2, NULL),
    ("Jenny", "Liu", 4, 1),
    ("Devon", "Smith", 1, NULL),
    ("Dustin", "Nguyen", 2, 3),
    ("Noelle", "Sanchez", 4, NULL);