# TaskMaster Software Requirements

## Table of Contents

-   [Introduction](#introduction)
-   [User Requirements Definition](#user-requirements-definition)
-   [System Architecture](#system-architecture)
-   [System Requirements Specification](#system-requirements-specification)
-   [System Models](#system-models)
-   [System Evolution](#system-evolution)

## Introduction:

The Family Task Management web app is designed to help families organise and manage their daily tasks, events, and shopping lists.

The app will be built using the MERN stack and potentially launched with Heroku. It will use mongoose, bcrypt, localStorage, and JSON web tokens to facilitate easier integrations and API/HTTP requests.

## User Requirements Definition:

The app will allow users to sign in, create and manage shopping lists, take notes, plan events and task deadlines using an integrated calendar, and receive weather information through a weather API.

The app will be secure, scalable, and optimised for fast load times and efficient user input and data processing.

The app should follow industry-standard security and performance guidelines.

## System Architecture:

The app will be built using the MERN stack and include front-end components built with React.

The app will be divided into modules for shopping, notes and tasks.

The app will reuse components and libraries from the MERN stack.

## System Requirements Specification:

The app should allow users to sign in, create and manage shopping lists, take notes, plan events, and manage task deadlines.

Users should also be able to add, assign, delete, edit, mark as complete, and filter tasks by status, deadline, and overdue.

The app will require a web browser and an internet connection to function properly.

## System Models:

Wireframes will be created using Figma and Draw, which will be used to show the app's design and functionality.

Figma will be the primary tool to create these system models and wireframes.

## System Evolution:

The app is based on the assumption that families need a simple and intuitive way to organise and manage their daily tasks and events.

Anticipated changes due to hardware evolution and changing user needs, etc.

The app may evolve to include additional features and integrations based on user feedback and changing industry standards.

## How to use the app:

-   Sign in to your account
-   Create and manage shopping lists, workouts and other tasks
-   Plan events and task deadlines

## Installation and Setup:

1. Clone the project repository from Github.
2. Navigate to the project directory.
3. Add your values to the following environment variables in the backend .env file:
   PORT=<your port number>
   MONGO_URI=<your MongoDB URI>
   JWT_SECRET=<your JWT secret key>

4. In the backend directory run `npm start` to install all required dependencies.
5. In the frontend directory run `npm start` to install all required dependencies and start the app.

## Security Measures:

To ensure the security of the app, we have implemented the following measures:

-   JSON web tokens stored in HTTP-only cookies to prevent cross-site scripting (XSS) attacks
-   Authentication routes to ensure only authorized users can access protected resources
-   Passwords encrypted using Bcrypt to protect against password cracking attacks
-   Validation and sanitisation of user input to prevent SQL injection and other security vulnerabilities.

## Link to App

https://taskmasterapp.herokuapp.com/dashboard
