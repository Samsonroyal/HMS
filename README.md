# Hospital Patient Management System
A web app for Hospital Patient Record Management, built as a final year project for Kiruddu Hospital.

## Hospital Patient Management System - Supports most of the standard HIMS functionalities:
* Doctor Assign
* Patient Appointment
* Doctor Prescription
* Billing
* Patient Login
* Doctor Login
* Employee Login
* Administrator Login

## Technologies used
* Back-End Technologies: Node Js, Express Js, MySQL
* Front-End Technologies: React Js, BootStrap
* Authentication provided using JWT
* SQL queries are parameterized to prevent SQL injection; input is validated on both server and client

### How to Run
* Start the Wampserver to ensure mysql db is running.
* Copy `.env.example` to `.env.local` and fill in your values (DB host, user, password, database name, and a strong `SECRET_KEY`). The DB credentials are read from the environment - do not hardcode them in `utils/db.js`.
* Create the database schema:
  ``` bash
  $ mysql -u root -p < schema.sql
  ```
* In a git bash terminal run the command below to start the react app.

  ``` bash
  $ bun install
  $ cd client
  $ bun install
  $ bun run start
  ```

* In another terminal run this command to start the sql server
  ``` bash
  $ bun run start
  ```

* Visit `localhost:3000` in your browser.

### Tests
``` bash
$ npm test
```
Runs lightweight regression checks (no DB required) that guard against hardcoded JWT secrets and string-interpolated SQL.
