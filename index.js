const express = require('express')
const mongoose = require('mongoose')
const todoHandler = require('./routerHandler/todoHandler')

// express app initialization
const app = express()

app.use(express.json())

// connection database with mongoose
mongoose.connect('mongodb://localhost/todo')
    .then(() => console.log('Database connection successfull!!'))
    .catch((e) =>console.log(e))

// all router
app.use('/todo', todoHandler)

// app.post('/todo', (req, res) => {
//     console.log(req.body)
//     res.end()
// })

// error handling middleware
function errorHandler(err, req, res, next) {
    if (res.headerSent) {
        return next(err)
    }
    res.status(500).json({error: err})
}

app.listen(3000, ()=> console.log('App is listening on 3000 port'))