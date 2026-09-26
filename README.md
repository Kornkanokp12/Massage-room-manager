# Nadii Room Manager
Nadii Room Manager is a simple web application for managing massage treatment rooms, therapist assignments, room status, and availability.
The application allows staff to quickly see which rooms are available, currently in use, or need cleaning.
## Live Application
https://stupendous-conkies-0f7622.netlify.app
## Features
- View all treatment rooms
- View room availability
- Add a new room
- Edit an existing room
- Delete a room
- Assign a therapist to a room
- Change room status
- Dashboard summary showing:
  - Total Rooms
  - Available Rooms
  - Rooms In Use
  - Rooms Needing Cleaning
- Data is stored in a Supabase database
- Changes remain after refreshing the website
## Room Status Options
Rooms can have one of three statuses:
- Available
- In Use
- Needs Cleaning
## Technologies Used
- HTML
- CSS
- JavaScript
- Supabase
- Netlify
- GitHub
## Database
Supabase is used as the backend database for the application.
The `rooms` table stores:
- Room ID
- Room Name
- Status
- Therapist
- Created At

The application supports CRUD operations:
- Create - Add a new room
- Read - Display rooms from the database
- Update - Edit room information
- Delete - Remove a room

## How to Run Locally
1. Clone or download this repository.
2. Open the project folder.
3. Open `index.html` in a web browser.
4. The application will connect to the Supabase database and display the treatment rooms.

## Project Purpose
This application was created as a prototype for managing treatment rooms in a massage facility. It provides a simple dashboard that allows staff to monitor room availability and update room information.

## Demo Video
[Watch the Nadii Room Manager Demo on YouTube](https://youtu.be/qSI2cFYfeFs)
