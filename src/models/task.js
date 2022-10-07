import mongoose from "mongoose";

const Schema = mongoose.Schema

const TaskSchema = new Schema(
    {
        description: {
            type: String,
            required: true,
            trim: true,
        },
        completed: {
            type: Boolean,
            default: false,
        },
        owner: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
        // password: {
        //     type: String,
        //     required: true,
        //     trim: true,
        //     minLength: 7,
        //     validate: (value) => {
        //         if(value.toLowerCase().includes("password")){
        //             throw new Error("Password must not include password word")
        //         }
        //     } 
        // }
    },
    {
        timestamps: true
    }
);


const Task = mongoose.model('Task', TaskSchema);

export default Task