//use npm run dev, configure on package.json before running
const express = require('express');
require('./db/mongoose');

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();


app.use(express.json());// converting all response to json
//USER
app.use(userRouter)
//TASKS
app.use(taskRouter)

module.exports = app;
