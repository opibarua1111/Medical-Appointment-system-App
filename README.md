# Medical Appointment System App

This project is a Medical Appointment Management System built with a frontend (Angular), backend (ASP.NET Core Web API), and a SQL Server database. It allows patients to book appointments, doctors to manage schedules, and admins to oversee the system.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.7.

Backend repository: [click](https://github.com/opibarua1111/Medical-Appointment-System-Api)

## 🚀 Tech Stack


## Frontend

Angular 19

Bootstrap 5

RxJS

ngx-toastr

## Backend

ASP.NET Core 8 Web API

Entity Framework Core

RESTful API Architecture

SOLID principles

## Database

Microsoft SQL Server

SQL Migration & Seed Scripts

Stored procedure

Relational database

## Database⚙️ Features

Doctor Management (Add, Update, View Doctors)

Patient Management

Appointment Booking & Scheduling

Prescription Management

Presciption Mail system with PDF attachment

## Frontend Setup (Angular)

Install dependencies:
```bash
npm install
```

Run the development server:
```bash
ng serve
```
Open in browser: 
```bash
[ng serve](http://localhost:4200/)
```

## 🔧 Backend Setup (ASP.NET Core)

Update appsettings.json with your SQL Server connection string:

```bash
"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER;Database=MedicalAppointmentDB;Trusted_Connection=True;TrustServerCertificate=True;"
}
```
Run database migrations:
```bash
Update-Database
```

