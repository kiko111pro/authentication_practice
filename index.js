const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

//setup express
const app = express()
app.use(express.json())
app.use(cors())

//listening on server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server started on Port: ${PORT}`)
})

// setup my mongoose
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if(err) throw err;
    console.log("MongoDB Connection Established!")
})

// setup routes
app.use("/users", require("./routes/userRouter"))