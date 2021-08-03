//define the mongoose schema

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Todo = new Schema ({
    todo_description: {
        type: String
    },
    todo_responsible: {
        type: String
    },
    todo_priority: {
        type: String
    },
    todo_completed: {
        type: Boolean
    }
});

//creating a model based on our schema - this gives us the possibility of importing into server.js
module.exports = mongoose.model('Todo', Todo);