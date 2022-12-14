# task-manager

## π Description

Task Manager API built using `Node.js`, `express`, `Mongoose`, `Jest`, `bcrypt` and `JWT` for user authentication

## π Features

* Creating accounts for new users
* Storing users data in `MongoDB` using `Mongoose` as ODM and securely hashing passwords
* Providing login, logout and deleting user accounts
* Authenticate users using JSON web tokens (JWT)
* Sending welcome and cancellation emails

## π οΈ Technologies/Frameworks Used

* [Node.js](https://nodejs.org/en/)
* [Express](https://expressjs.com/)
* [MongoDB](https://www.mongodb.com/)
* [Mongoose](https://mongoosejs.com/)
* [JSON Web Token (JWT)](https://jwt.io/)
* [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
* [multer](https://github.com/expressjs/multer)
* [sharp](https://github.com/lovell/sharp)
* [Mailgun](https://www.mailgun.com/)
* [Jest](https://jestjs.io/)
  
### Documentation Sample
![Screenshot 2022-10-07 003635](https://user-images.githubusercontent.com/49661363/194443082-111a73ae-1e39-49bd-aa9e-821144d785a8.png)

> For full api documentation -> [API Documentation](https://documenter.getpostman.com/view/12149068/2s83zfRRAE)

## βοΈ Installation

> Install project dependencies via npm package manager

```bash
$ npm install
```

### Environment Variables

> In src/.env file

```env
PORT=//desired port

#Database
MONGODB_URL=//your mongodb connection url

#JWT authentication
JWT_SECRETKEY=//chosen secret key

#Mailgun email service
MAILGUN_API_KEY=//mailgun api key
MAILGUN_DOMAIN=//mailgun domain
```

> To install dotenv package for development

```bash
$ npm i dotenv --save-dev
```

### Usage

```bash
# To run the app
$ npm start

# To run the app in development mode
$ npm run dev
```

## π Directory Structure
```
|   .env
β   .gitignore
β   package-lock.json
β   package.json
β
ββββsrc
    β   index.js
    β   README.md
    β
    ββββdb
    β       mongoose.js
    β
    ββββemails
    β       account.js
    β
    ββββmiddleware
    β       auth.js
    β
    ββββmodels
    β       task.js
    β       user.js
    β
    ββββroutes
            task.routes.js
            user.routes.js
```

Owner: [Moaz Mohamed](https://github.com/moaz-mohamed)



