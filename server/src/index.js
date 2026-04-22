import dotenv from "dotenv"
dotenv.config()
import app from "./app.js"
import connectDB from "./db/db.js";




const port=process.env.PORT;

connectDB()
.then(()=>{
    app.listen(port,()=>{
console.log(`App is listening on http://localhost:${port}`)
})
}

)
.catch((err)=>{
    console.error("MongoDB connection error",err)
    process.exit(1)
})