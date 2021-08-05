const express = require('express')
const router = new express.Router();
const Task = require('../models/task');
const auth = require('../middlewares/auth');

router.post('/task', auth, async (req, res) => {
    // const task = new Task(req.body);

    const task = new Task({
        ...req.body,
        ownerID: req.user._id
    })
    try{
        await task.save();
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
});

router.get('/tasks', auth, async (req, res) => {
    try{
        // const tasks = await Task.find({}); // getting all tasks despite of the login user
        // const tasks = await Task.find({ownerID: req.user.id}) // not using populate()

        const match = {}
        // 1 for ASC, -1 for DESC
        const sort = {}
        if(req.query.completed){
            match.completed = req.query.completed === 'true'
        }
        if(req.query.sortBy){
            const part = req.query.sortBy.split(':')
            sort[part[0]] = part[1] === 'desc' ? -1 : 1;
        }
        await req.user.populate({
            path: 'tasks',
            match,
            options:{
                skip: parseInt(req.query.skip), //note the page=1 will be skip=0
                limit: parseInt(req.query.limit),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    }catch(e){
        res.status(500).send(e)
    }
});

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try{
        // const task = await Task.findById({_id}); // getting tasks by id despite of the login user
        const task = await Task.findOne({_id, ownerID: req.user.id})
        if(!task){
            return res.status(404).send();
        }
        res.send(task);
    }catch(e){
        res.status(500).send(e);
    }
});

router.patch('/task/:id' , async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidUpdates = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidUpdates){
        return res.send(400).send('Error: Invalid fields!')
    }

    try{
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        const task = await Task.findByOne({_id:req.params.id, ownerID: req.user._id});
        
        if(!task){
            return res.status(404).send();
        }
        updates.forEach((update) => {
            task[update] = req.body[update]
        });

        await task.save();
        res.send(task);
    }catch(e) {
        res.status(500).send(e);
    } 
});

router.delete('/task/:id', auth, async (req, res) => {
    try{
        // const task = await Task.findByIdAndDelete(req.params.id)

        const task = await Task.findOneAndDelete({_id: req.params.id, ownerID: req.user._id});

        if(!task){
            return res.status(404).send();
        }

        res.send(task);
    }catch(e) {
        res.status(500).send(e)
    }
});

module.exports = router;