import mongoose from "mongoose";


mongoose.connect(process.env.MONGODB_URL).then(
    console.log('Connected successfully')
).catch((error) =>
    console.log(error)
)







