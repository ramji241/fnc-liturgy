# environment

Create a folder for this project
Create a package.json file:
    $ npm init
Create server.js:
    $ touch server.js
Install Express:
    $ npm i express --save
Add Express to server.js:
   const express = require('express')
   const app = express()
Install Nodemon as a dev dependency:
    $ npm i nodemon --save-dev
Add Nodemon to the script key in package.json:
   "scripts": {
       "start": "nodemon server.js"
   }
<!-- From now on, you can run server.js by typing: $ npm run start -->
Install .dotenv:
    $ npm i dotenv --save
<!-- Require the .env file in server.js:
    require('dotenv').config({path: './config/.env}) -->
Add dotenv as a dependency:
    $ npm i -D dotenv
<!-- Create /config/.env and setup your default port:
    PORT = 3000 -->
Declare PORT in server.js:
    const PORT = process.env.PORT || 3000 <!-- Or a different port number of your choosing -->

# models

Create /models
Install MongoDB:
    $ npm i mongodb --save
Add MongoDB connection string to .env file:
    DB_STRING = mongodb+srv://..., which is the connection string obtained from MongoDB
Install Mongoose:
    $ npm i mongoose --save
Require Mongoose in server.js:
    const mongoose = require('mongoose')
Create database.js in your config folder (see code below)
Require database.js in server.js:
    const connectDB = require('./config/database')
Call connectDB in server.js:
    connectDB()

# views

Create /views
Install EJS:
    $ npm i ejs --save
Set EJS as the default view engine in server.js:
    app.set('view engine','ejs')
Create /public/css/ and /public/js/, and move your static CSS and JS files into those folders
Instruct your app to use the static files in the public folder:
    app.use(express.static('public'))
Instruct your app how to read JSON and strings/arrays in the body of data for POST and PUT requests:
    app.use(express.urlencoded({extended: true}))
    app.use(express.json())

# controllers
Create /controllers

# routes
Create /routes

# database.js

const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

module.exports = connectDB