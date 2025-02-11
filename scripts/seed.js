import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfigPath = path.join(__dirname, '../database.yaml');
const dbConfig = yaml.load(fs.readFileSync(dbConfigPath, 'utf8'));

const { sqlite_path: sqlitePath } = dbConfig;

const db = new sqlite3.Database(sqlitePath);

const employees = [
  {
    full_name: 'John Doe',
    email: 'john.doe@example.com',
    phone_number: '123-456-7890',
    date_of_birth: '1985-06-15',
    job_title: 'Software Engineer',
    department: 'IT',
    salary: 75000,
    start_date: '2020-03-01',
    end_date: null
  },
  {
    full_name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone_number: '987-654-3210',
    date_of_birth: '1990-09-20',
    job_title: 'Project Manager',
    department: 'Operations',
    salary: 85000,
    start_date: '2018-07-15',
    end_date: null
  },
  {
    full_name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phone_number: '555-123-4567',
    date_of_birth: '1995-02-10',
    job_title: 'UX Designer',
    department: 'Design',
    salary: 68000,
    start_date: '2022-01-05',
    end_date: null
  },
];

const timesheets = [
  {
    employee_id: 1,
    start_time: '2025-02-10 08:00:00',
    end_time: '2025-02-10 17:00:00',
    work_summary: 'Developed a new feature for the dashboard'
  },
  {
    employee_id: 2,
    start_time: '2025-02-11 12:00:00',
    end_time: '2025-02-11 17:00:00',
    work_summary: 'Managed a project meeting with stakeholders'
  },
  {
    employee_id: 3,
    start_time: '2025-02-12 07:00:00',
    end_time: '2025-02-12 16:00:00',
    work_summary: 'Designed a new user interface layout'
  },
];

const insertData = (table, data) => {
  const columns = Object.keys(data[0]).join(', ');
  const placeholders = Object.keys(data[0]).map(() => '?').join(', ');

  const insertStmt = db.prepare(`INSERT INTO ${table} (${columns}) VALUES (${placeholders})`);

  data.forEach(row => {
    insertStmt.run(Object.values(row));
  });

  insertStmt.finalize();
};

db.serialize(() => {
  insertData('employees', employees);
  insertData('timesheets', timesheets);
});

db.close(err => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Database seeded successfully.');
  }
});
