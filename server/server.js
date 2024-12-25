const e = require('express')
const app = e()
const router = require('./Routes/routes')
const mongoose = require('mongoose')
const cors = require('cors')
//Load environment variables from .env
require('dotenv').config();

const path = require('path')

app.use(cors())
app.use(e.json())

app.use(e.static(path.join(__dirname, "build")));
app.get("/", (req,res)=>{
    res.sendFile(__dirname,"build/index.html");
})

app.use("/api",router)

mongoose.connect(process.env.dbURL)
.then(()=> console.log("Connected Successfully")).catch((error)=>console.log(error));

const Port = process.env.port || 5000
app.listen(Port , () => {
    console.log(`Server at : http://localhost:${Port}`);
    
})