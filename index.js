const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const todoHandler = require('./routerHandler/todoHandler')
const userHandler = require('./routerHandler/userHandler')

// express app initialization
const app = express()
dotenv.config()
app.use(express.json())

// connection database with mongoose
mongoose.connect('mongodb://localhost/todo')
    .then(() => console.log('Database connection successfull!!'))
    .catch((e) =>console.log(e))

// all router
app.use('/todo', todoHandler)
app.use('/user', userHandler)


// error handling middleware
function errorHandler(err, req, res, next) {
    if (res.headerSent) {
        return next(err)
    }
    res.status(500).json({error: err})
}

app.use(errorHandler)

app.listen(3000, ()=> console.log('App is listening on 3000 port'))