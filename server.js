const express = require('express'); 
const app = express(); 
const bodyParser = require('body-parser');
const cors = require ('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const PORT = 4000;

//import the model from the schema
let Todo = require('./todo.model');

// add middleware
app.use(cors());
app.use(bodyParser.json());

//creates the connection
mongoose.connect('mongodb://127.0.0.1:27017/todos', {useNewUrlParser: true });

//retrieve a reference to the connection object
const connection = mongoose.connection;

//once takes two params - callback activated once a connection is opened
connection.once('open', function() {
    console.log("Mongodb database connection established successfully");
})

//Endpoints and logic for api calls
todoRoutes.route('/').get(function(req, res) {
    Todo.find(function(err, todos) {
        if (err) {
            console.log(err);
         } else {
             res.json(todos);
         }
    });
});

//retrive one specific todo based on id
todoRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Todo.findById(id, function(err, todo) {
        res.json(todo);
    });
});

//send http post when adding new items to database
todoRoutes.route('/add').post(function(req, res) {
    let todo = new Todo(req.body);
    todo.save()
        .then(todo => {
            res.status(200).json({'todo:': 'todo added successfully'});
        }) 
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

//update existing todo items
todoRoutes.route('/update/:id').post(function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
        if (!todo)
            res.status(404).send('data is not found');
        else 
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;

            todo.save().then(todo => {
                res.json('Todo updated');
            })
            .catch(err => {
                res.status(400).send('Update not possible');
            });
    });
});

//insert Router  which is middleware so we use 'use'
app.use('/todos', todoRoutes);

//start server process on port 4000
app.listen(PORT, function() {
    console.log("Server is running on PORT: " + PORT);
});

