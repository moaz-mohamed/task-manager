import jwt from "jsonwebtoken";
import User from "../models/user.js";


const auth = async (req, res, next)  => {
   // console.log(req)
    try {
        const token = req.header('Authorization').split(' ')[1]
       // console.log(token)
        const decoded = jwt.verify(token, process.env.JWT_SECRETKEY)
       // console.log(decoded)
        const user = await User.findOne({_id: decoded._id , 'tokens.token': token})
        if(!user) {
            throw Error()
        }
        req.token = token
        req.user = user
        next()


        
    } catch (e) {
        res.status(401).send({error: 'Authentication failed'})
    }
}


export default auth