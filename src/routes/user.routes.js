import express from "express";
import User from "../models/user.js";
import auth from "../middleware/auth.js";
import multer from "multer";
import sharp from "sharp";
import {sendWelcomeEmail, sendCancelationEmail } from "../emails/account.js";

const router = express.Router()
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(new RegExp('\.(jpg|jpeg|png)$'))) {

            cb(new Error('Please upload an image of type (jpg, jpeg, png)'))

        }
        cb(undefined, true)
    }
})

//---------------------------------------Routes------------------------------------------\\

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
    //    sendWelcomeEmail(user.email, user.name)
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.post('/users/login', async (req, res) => {
    
    try {
        const user = await User.findUserByEmailAndPassword(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        // console.log(user)
        res.send({ user, token })

    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
  

    const buffer = await sharp(req.file.buffer).resize({width:200, height:200}).png().toBuffer()

    req.user.avatar = buffer
    await req.user.save()
    res.send('Uploaded successfully')
  },
   (err, req, res, next) => {
    return res.status(400).send({error: err.message})

})

router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        if(!req.user.avatar) {
          throw new Error('No avatar to be deleted')

        }
        req.user.avatar = undefined
        await req.user.save()
        res.send('Deleted successfully')
        
    } catch (e) {
        res.status(400).send(e.message)
    }
})


router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar) {
            throw new Error('No user/avatar found')
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

        
    } catch (e) {
        res.status(404).send(e.message)
    }
   
    
})



router.get('/users/logout', auth, async (req, res) => {

    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()

        res.send("Logged out")


    } catch (e) {
        res.status(500).send(e.message)

    }
})



router.get('/users/logoutAll', auth, async (req, res) => {

    try {
        req.user.tokens = []

        await req.user.save()

        res.send("Logged out from all devices")


    } catch (e) {
        res.status(500).send(e.message)

    }



})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})



router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const user = req.user
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        res.send(user)

    } catch (e) {
        res.status(400).send(e)
    }
})




router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.deleteOne()
       // sendCancelationEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})




export default router