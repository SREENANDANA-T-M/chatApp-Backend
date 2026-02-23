const mongoose = require("mongoose")

mongoose.connect(process.env.CONNECTIONSTRING)
.then(() => {
    console.log("MongoDB Connected Successfully")
})
.catch((err) => {
    console.log("MongoDB Connection Failed:", err)
})
