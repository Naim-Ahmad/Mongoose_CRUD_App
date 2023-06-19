const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const router = express.Router()
const userSchema = require('./../schemas/userSchema')
const checkLogin = require('../middleware/checkLogin')
const User = mongoose.model("User", userSchema)

// Signup
router.post('/signup', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    try {
        const newUser = new User({
        name: req.body.name,
        username: req.body.username,
        password: hashedPassword
        })
        await newUser.save()
        res.status(200).json({
            message: "User Saved Successfully!"
        })
    } catch {
        res.status(500).json({
            error: 'There was a server side Error'
        })
   }
})

// Login 
router.get('/login', async (req, res) => {
    try {
        
        const user = await User.find({ username: req.body.username })

        if (user && user.length > 0) {
            const isValidPassword = await bcrypt.compare(req.body.password, user[0].password)
            if (isValidPassword) {
                // generate token
                const token = jwt.sign(
                  { name: user[0].name, id: user[0]._id },
                  process.env.JWT_SECRET,
                  {
                    expiresIn: '1h',
                  }
                );

                res.status(200).json({
                    "access_token": token,
                    "message": "Login successful!"
                })
            
            } else {
                res.status(401).json({
                    error: 'Authentication failed!',
                });
            }
        
        } else {
            res.status(401).json({
                error: 'Authentication failed!',
            });
        }
    } catch (err) {
        res.status(401).json({
            error: 'Authentication failed!',
            details: err
        });
    }
})

// Get all the user
router.get('/all', checkLogin,  async (req, res) => {
    try {
        const data = await User.find({}).populate('todos')
        console.log(data)
        res.status(200).json({
            data: data
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: "There was a server side error!"
        })
    }
})

module.exports = router