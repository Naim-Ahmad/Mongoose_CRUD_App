const express = require('express')
const mongoose = require('mongoose')
const todoSchema = require('../schemas/todoSchema')
const userSchema = require('../schemas/userSchema')
const checkLogin = require('../middleware/checkLogin')
const router = express.Router()
const Todo = new mongoose.model("Todo", todoSchema)
const User = new mongoose.model("User", userSchema)

// GET All The Todo's
router.get('/', checkLogin, async(req, res)=> {
  try {
    const result = await Todo.find({}).populate("user", "username password -_id").select({
      _id: 0,
      __v: 0
    })
    
  res.status(200).json({
    data: result
  })
  } catch(err) {
    res.status(500).json({
      error: "error"
    })
  }
})

// Get active todo's
router.get('/active', async (req, res) => {
  const todo = new Todo()
  try {
    const activeData = await todo.activeTodo();
    res.status(200).json({
      data: activeData
    })
  } catch (err) {
    res.status(500).json({
      error: err
    })
  }
})

// get meet todo's
router.get('/meet', async (req, res) => {
  try {
    const data = await Todo.findMeet();
    res.status(200).json({
      data: data
    })
  } catch (error) {
    res.status(500).json({
      error
    })
  }
})

// query helper (chain kora jay)
router.get('/telawat', async (req, res) => {
  try {
    const data = await Todo.find().byTelawat();
    res.status(200).json({
      data: data
    })
  } catch (error) {
    res.status(500).json({
      error: error
    })
  }
})

// GET a Todo By ID
router.get('/:id', async(req, res)=> {
  try {
    const result = await Todo.findById(req.params.id).exec()
    res.status(200).json({
      result
    })
  } catch (err) {
    res.status(500).json({
      error: err
    })
  }
  
})

// POST a todo
router.post('/', checkLogin, async (req, res) => {
  const newTodo = new Todo({
    ...req.body,
    user: req.userId
  })
  try {
    const todo = await newTodo.save();
    
    await User.updateOne({
      _id: req.userId
    }, {
      $push: {
        todos: todo._id
      }
    })
    res.status(200).json({
      Message: 'Todo Was Inserted Successfully',
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server Side Error' + error,
    });
  }
})

// POST multiple todo's
router.post('/all', async(req, res)=> {
  try {
    await Todo.insertMany(req.body);
    res.status(200).json({
      message: "todo's ware inserted successfully!"
    })
  } catch {
    res.status(500).json({
      error: "There was a server side error!"
    })
  }
})

// PUT many todo's
router.put('/many', async (req, res) => {
  try {
    await Todo.updateMany({ status: 'active' }, { status: 'inactive' })
    res.status(200).json({
      message: "Todo's were successfully updated!"
    })
  } catch (err) {
    res.status(500).json({
      error: "There was a server side error!"
    })
  }
})

// PUT a todo by id
router.put('/:id', async (req, res) => {
  try {
    await Todo.updateOne({ _id: req.params.id }, req.body)
    res.status(200).json({
      message: "Data updated successfully!"
    })
  } catch(err) {
    res.status(500).json({
      error: "There was a server side error!"
    })
  }
})

// delete all todo's
router.delete('/many', async (req, res) => {
  try {
    await Todo.deleteMany({}).exec()
    res.status(200).json({
      message: "All Todo's successfully deleted!"
    })
  } catch (error) {
    res.status(500).json({
      error
    })
  }
})

// delete a todo
router.delete('/:id', async(req, res)=> {
  try {
  await Todo.deleteOne({ _id: req.params.id }).exec();
  res.status(200).json({
    message: "successfully deleted!"
  })
  } catch (error) {
    error
  }
})

module.exports = router