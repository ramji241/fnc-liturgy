const express = require('express') //#1
const app = express() //#2
const mongoose = require('mongoose') //#3
const session = require('express-session') //#5
const MongoDBStore = require('connect-mongodb-session')(session) //#6
const connectDB = require('./config/database') //#9
const PORT = process.env.PORT || 3000

// const passport = require('passport') //#4
// const flash = require('express-flash') //#7
// const logger = require('morgan') //#8

const mainRoutes = require('./routes/main')
const builderRoutes = require('./routes/builder')

// require('./config/passport')(passport)

// connectDB()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// app.use(logger('dev'))

// app.use(
//     session({
//       secret: 'keyboard cat',
//       resave: false,
//       saveUninitialized: false,
//       store: new MongoDBStore({ mongooseConnection: mongoose.connection }),
//     })
//   )

// app.use(passport.initialize())
// app.use(passport.session())

// app.use(flash())
  
app.use('/', mainRoutes)
app.use('/builder', builderRoutes)
 
app.listen(PORT, () => {
    console.log("listening for requests");
})