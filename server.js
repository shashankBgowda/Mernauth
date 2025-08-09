import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";

const app = express();
const port = process.env.PORT || 4000;
connectDB();
app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true}))

app.get("/", (req,res)=>{
    res.send("API working all fine");
})
app.listen(port, () =>{
    console.log("server strarted on port", port);
});
