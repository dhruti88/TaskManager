import mongoose from "mongoose";


//Define Schmea for tasks
const taskSchema = new mongoose.Schema(
    {
        title: {
            type : String,
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            required: true,
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    },

    { timestamps: true } // Enable timestamps
);

//task collection for storing tasks
const Task = mongoose.model("task", taskSchema); 
export default Task;