This is simple Staff Management

This system allows you to manage staff members, including creating, updating, deleting, searching for staff members. It also provides feasibility for exporting staff data to Excel and PDF formats.

API Endpoints
 - POST /staff: Create a new staff member
 - GET /staff: Get all staff members
 - PUT /staff/:id: Update an existing staff member
 - DELETE /staff/:id: Delete an existing staff member
 - GET /staff/search: Search for staff members based on criteria
 - GET /staff/export/excel: Export staff data to Excel format
 -GET /staff/export/pdf: Export staff data to PDF format

UI

1 Create a new staff member:

 - Input fields: Staff ID, Full Name, Birthday, Gender
 - Button: "Create Staff Member"

2 Update an existing staff member:

 - Input fields: Staff ID (to identify the staff member to update), Updated Information
 - Button: "Update Staff Member"

3 Delete an existing staff member:

 - Button: "Delete Staff Member"

4 Search for staff members:

 - Input fields: Search criteria (e.g., Gender, Birthday Range)
 - Button: "Search"

5 Export staff data:

- Export options: Excel or PDF format
- Button: "Export to Excel" and "Export to PDF"

Getting Started
To get started with the system, follow these steps:

Clone the repository: git clone https://github.com/ChhenglinHor/staff-management-fullstack.git

Running Server

cd to server folder

Install dependencies: npm install

Start the server: npm start

Access the API at http://localhost:8000 (or the port you've configured in .env)

Running unit tests for server

npm test

Running Client

cd to web folder

Install dependencies: npm install

Start the server: npm start

All done!!!