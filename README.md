# Udacity React Nanodegree Project 2
> Readable: A Content And Comment App

## Usage

```bash
cd customer-authentication
npm install
npm start
```

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). More information can be found [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md)

## Requirements
This exercise should be completed in 4-6 hours or less. The solution must be runnable and can be written in any programming language.

The challenge is to build a UI backed by HTTP-based RESTful API for managing Customers and their Certificates. 

A Customer:
Has a name
Has an email address
Has a password
May have zero to many Certificates

A Certificate:
Belongs to one and only one Customer
Can be either active or inactive
Has a private key
Has a certificate body

Your solution must support:
Creating/Deleting Customers
Creating Certificates
Listing all of a Customer’s Active Certificates
Activating/Deactivating Certificates. 
Persistence (data must survive computer restarts)

Shortcuts
No authentication is required. Though the data model specifies a user password, you don’t have to implement authentication (login) or authorization (ensuring users can’t see each other’s data).
Though private keys in the real world are extremely sensitive, you needn’t treat them as anything other than a blob of bytes for this exercise. For the password field, however, you should try to treat it as you would a typical password.
UI should consume and render JSON data returned from REST API.

