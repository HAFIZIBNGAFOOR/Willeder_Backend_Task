# Willeder Backend Task

## Overview

This project demonstrates the implementation of JWT authentication, user password management, and email sending using SendGrid.

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
  - [Authentication](#authentication)
  - [User Management](#user-management)
  - [Email Service](#email-service)
- [Error Handling](#error-handling)
- [License](#license)

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-repo/project.git
cd project
npm install


#setup env file and add folowing keys
ACCESS_TOKEN_EXPIRED_IN=1m
REFRESH_TOKEN_EXPIRED_IN=2m
JWT_SECRET=your_jwt_secret
SENDGRID_API_KEY=your_sendgrid_api_key
PRIVATE_KEY= firesbase private key
CLIENT_EMAIL=firebase client email
PRIVATE_KEY_ID= firebase private key id

**USAGE**
## Authentication
1.Register
2.Login Function
3.Authenticate Token Middleware

**User Management**
1.Update User Account
2.Update User Password

**Send Email with SendGrid**
1.sending email

**Error Handling**
Standard error handling is implemented to log errors and send appropriate HTTP responses.
