🏧 ATM Application – Backend

This project is a backend implementation of an ATM system developed using Java and Spring Boot, following modern backend development practices. The application provides core banking functionalities such as account creation, secure login, balance inquiry, deposits, withdrawals, fund transfers, and transaction history.

Initially, this project was implemented using JDBC, and later refactored and upgraded to Spring Boot using Spring Data JPA and Hibernate for better scalability, maintainability, and cleaner architecture.


🚀 Technologies Used

Java
Spring Boot
Spring Data JPA
Hibernate (ORM)
SQL (MySQL-compatible database)
RESTful APIs
Session-based authentication
Maven


🗄️ Database & Deployment

Database: SQL database hosted on Aiven
Backend Deployment: Deployed on Render
ORM: Hibernate with JPA for database interaction
The application uses JPA repositories instead of raw SQL queries, making database operations more efficient and readable.


🔐 Authentication & Security

Session-based login mechanism
PIN verification for every sensitive operation
Secure validation for deposits, withdrawals, transfers, and transaction access


⚙️ Features

Create new bank accounts
Secure login using account number and PIN
Check account balance
Deposit money
Withdraw money
Transfer money between accounts
View transaction history (sorted by latest transactions)
Proper exception handling and validation


🧠 Learning & Improvements

Migrated from JDBC to Spring Boot + JPA
Improved code structure using layered architecture (Controller, Service, Repository)
Reduced boilerplate code using Hibernate ORM
Enhanced scalability and deployment using cloud services


📦 Project Structure

controller  → REST API endpoints  
service     → Business logic  
repository  → JPA repositories  
entity      → Database entities  
exception   → Custom exception handling  


🌐 Live Backend

The backend service is live and deployed on Render, with the database securely hosted on Aiven.
