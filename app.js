const express = require("express");
const app = express();
const cors = require("cors");

const config = require("dotenv");
// require("./config/config.env");
require("./db/conn");
const Event = require("./routes/Events");
const Auth = require("./routes/Auth");

const cookiParser = require("cookie-parser")

const port = process.env.PORT || 8000;


// middleware function
app.use(express.json());
app.use(cookiParser());
// app.use(cors({credentials: true, origin: 'https://master--tourmaline-buttercream-89b5eb.netlify.app/'}));
app.use(cors({credentials: true}));

app.use(Event);
app.use(Auth);
app.use(express.urlencoded({ extended: true }));


app.get("/", (req,res)=>{
    res.status(201).json("server created");
});

app.listen(port, ()=>{
    console.log(`server start at port no: ${port}`);
});