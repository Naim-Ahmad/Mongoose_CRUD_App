const express = require('express')
const mongoose = require('mongoose')
const todoSchema = require('../schemas/todoSchema')
const router = express.Router()
const Todo = new mongoose.model("Todo", todoSchema)

// GET All The Todo's
router.get('/', async(req, res)=> {
  try {
    const result = await Todo.find({}).select({
      _id: 0,
      __v: 0
  })
  res.status(200).json({
    result
  })
  } catch(err) {
    res.status(500).json({
      error: "error"
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
router.post('/', async (req, res)=> {
    const newTodo = new Todo(req.body)
         try {
           await newTodo.save();
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