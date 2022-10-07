import mongoose from "mongoose";
import validator from "validator"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Task from "./task.js";


const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Email is invalid')
                }
            }
        },
        password: {
            type: String,
            required: true,
            minlength: 7,
            trim: true,
            validate(value) {
                if (value.toLowerCase().includes('password')) {
                    throw new Error('Password cannot contain "password"')
                }
            }
        },
        age: {
            type: Number,
            default: 0,
            validate(value) {
                if (value < 0) {
                    throw new Error('Age must be a postive number')
                }
            }
        },
        tokens: [{
            token: {
                type: String,
                required: true
            }
        }],
        avatar: {
            type: Buffer
        }
    },
    {
        timestamps: true
    }
)

// generate token for authenticated user

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRETKEY, { expiresIn: "7 days" })
    user.tokens.push({ token })
    await user.save()
    return token

}

// send public data only

userSchema.methods.toJSON = function () {
    const userObject = this.toObject()
    delete userObject.tokens
    delete userObject.password
    delete userObject.avatar

    return userObject
}

// create virtual relation between user and tasks

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'

})

// find user by email and password
userSchema.statics.findUserByEmailAndPassword = async (email, password) => {

    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Invalid Email")
    }

    const isMatch = await (bcrypt.compare(password, user.password))
    if (!isMatch) {
        throw new Error("Invalid Password")

    }
    return user;

}


// hashing password before saving into database
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})


// deleteing user's tasks if user is removed
userSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()

})

const User = mongoose.model('User', userSchema)

User.createIndexes()

export default User

