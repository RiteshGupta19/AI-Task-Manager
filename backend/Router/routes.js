const express = require('express')
const Router = express.Router();
const {signUp, signIn, refreshAccessToken, getUserData} = require('../Controller/authController')
const {authMiddleware} = require('../Middleware/authMiddleware');
const { suggestTasks, getPriorities, createTask, getTasks, deleteTask, getSingleTask, updateTask, getTaskCounts } = require('../Controller/taskController');
const taskUpload = require('../Middleware/imageMiddleware')

// AUTH


Router.post('/sign-up', signUp)
Router.post('/sign-in', signIn)
Router.get('/users/profile', authMiddleware, getUserData);

// TASK

Router.get('/priorities', authMiddleware, getPriorities);
Router.post('/suggest-tasks', authMiddleware, suggestTasks);
Router.post('/create-task', authMiddleware, taskUpload.single('attachment'), createTask);
Router.put('/update-task/:id', authMiddleware, taskUpload.single('attachment'), updateTask);
Router.get('/tasks', authMiddleware, getTasks);
Router.delete('/delete/task/:id', authMiddleware, deleteTask);
Router.get('/task/:id', authMiddleware, getSingleTask);
Router.get('/count/task', authMiddleware, getTaskCounts);



module.exports = Router;