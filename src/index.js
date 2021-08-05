//use npm run dev, configure on package.json before running
const app = require('./app')

const port = process.env.PORT || 3000;

//test function for error
// const testErrorMiddleware = (req, res, next) => {
//     throw new Error('Testing errorMiddleware')
// }

app.listen(port, () => {
    console.log('Server running on port ', port);
});

// const jwt = require('jsonwebtoken');

// const test = () => {
//     const token = jwt.sign({_id: 'abc123'}, 'thisismytaskmanager', {expiresIn: '7 days'});
//     // console.log(token);

//     const verified = jwt.verify(token, 'thisismytaskmanager')
//     // console.log(verified);
// }

// test();

// const Task = require('./models/task');
// const User = require('./models/user');

// const main = async () => {
//     // const task = await Task.findById('610964f718c76604b8be742a');
//     // await task.populate('ownerID').execPopulate()
//     // console.log(task);

//     const user = await User.findById('61096406514f3207a0c1cf2b');
//     await user.populate('tasks').execPopulate();
//     console.log(user.tasks);
// }

// main();
