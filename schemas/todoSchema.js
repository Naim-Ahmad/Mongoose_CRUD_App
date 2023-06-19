const mongoose = require('mongoose')

const todoSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    status: {
        type: String,
        enum: ['active', 'inactive']
    },
    date: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
})
// Instance method
todoSchema.methods = {
    activeTodo: function () { 
        return mongoose.model('Todo', todoSchema).find({ status: 'active' });
    }
    
};

// static method
todoSchema.statics = {
    findMeet: function () {
        return this.find({title: /meet/i})
    }
}

// query helpers 
todoSchema.query = {
    byTelawat: function () {
        return this.find({title: new RegExp('telawat', 'i')})
    }
}

module.exports = todoSchema