
/*
Implement the following endpoints (with appropriate HTTP methods):
■ GET /api/tasks: Get a list of all tasks.
■ GET /api/tasks/{id}: Get a specific task by its ID.
■ POST /api/tasks: Create a new task.
■ PUT /api/tasks/{id}: Update a task by its ID.
■ DELETE /api/tasks/{id}: Delete a task by its ID.
*/

import express from "express";
import Task from "../models/task.js";
import auth from "../middleware/authentication.js";

const router = express.Router();

//check task routes
router.get('/test', auth, (req, res) => {
    res.send({
        message: 'Task routes are working!',
        user: req.user
    });
});


//CRUD Ops for registered users

//create a new task
router.post('/', auth, async (req, res) => {
    try{
        //get title,desc,status,owner from body
        const task = new Task({
            ...req.body,
            owner: req.user._id,
        });

        await task.save();
        res.status(201).json({task, message:"Task created Succesfully"});
    } 
    catch(err)
    {
        res.status(400).send({error:err});
    }

});

//Get a list of all tasks of a user
router.get('/', auth, async (req, res) => {
    try{
        const tasks = await Task.find({
            owner: req.user._id
        })
        res.status(200).json({tasks, count: tasks.length, message: "Tasks Fetched Successfully"});
    }
    catch(err){
        res.status(500).send({error: err});
    }
});


// Get a specific task by its ID.

router.get('/:id', auth , async (req,res)=>{
    const taskid = req.params.id;

    try{
        const task = await Task.findOne({
            _id: taskid,
            owner: req.user._id
        });
        
        if(!task){
            return res.status(404).json({message: "Task not found"});
        }
        res.status(200).json({task, message: "Task Fetched Successfully"});
    }
    catch(err){
        res.status(500).send({error: err});
    }
});

// Update a task by its ID.
router.patch('/:id', auth , async (req,res)=>{
    const taskid = req.params.id;
    const updates = Object.keys(req.body);
    // {
    //     description : "new description",
    //     status: done,
    //     owner : "new owner"
    // }
    const allowedUpdates = ['description', 'status'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if(!isValidOperation){
        return res.status(400).json({error: "Invalid Updates"});
    }

    try{
      const task = await Task.findOne({
            _id: taskid,
            owner: req.user._id
      });

        if(!task){
            return res.status(404).json({message: "Task not found"});
        }

        updates.forEach(update => task[update] = req.body[update]);
        await task.save();

        res.json({
            message: "Task Updated Successfully",
        })
    }
    catch(err){
        res.status(500).send({error: err});
    }
})


// Delete a task by its ID.
router.delete('/:id', auth , async (req,res)=>{
    const taskid = req.params.id;

    try{
        const task = await Task.findOneAndDelete({
            _id: taskid,
            owner: req.user._id
        });
        if(!task){
            return res.status(404).json({message: "Task not found"});
        }
        res.status(200).json({task, message: "Task Deleted Successfully"});
    }
    catch(err){
        res.status(500).send({error: err});
    }
})






export default router;
