import express from "express"
import cors from "cors"

const app=express();

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

app.use(cors({
    origin:process.env.CORS_ORIGIN?.split(";")|| "http://localhost:4000",
    Credential:true,
    allowedHeaders:["Content-Type","Authorization"]
}),
);



export default app