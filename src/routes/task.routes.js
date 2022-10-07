import express from "express";
import Task from "../models/task.js";
import auth from "../middleware/auth.js";

const router = express.Router()

router.post('/tasks', auth, async (req, res) => {

    try {
        if (!req.body) {
            return res.send("Invalid request")
        }

        const task = new Task(
            {
                ...req.body, owner: req.user._id
            })
        await task.save()
        res.send(task)

    } catch (e) {
        res.status(400).send(e)

    }
})


router.get('/tasks', auth, async (req, res) => {

    const match = {}
    const sort = {}
    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'asc' ? 1 : -1
    }
    
    try {
        await req.user.populate(
            {
                path: 'tasks',
                match,
                
                options: {
                    limit: parseInt(req.query.limit),
                    skip: parseInt(req.query.skip),
                    sort
                }
            })
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send(e)
    }

})

router.get('/tasks/:id', auth, async (req, res) => {

    

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            return res.status(404).send('No task found')
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)

    }
})


router.patch('/tasks/:id', auth, async (req, res) => {

    const updates = Object.keys(req.body)

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            return res.status(404).send('No task found')
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(400).send(e)

    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            return res.status(404).send('No task found')
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }


})

export default router