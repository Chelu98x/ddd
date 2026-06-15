const express = require('express')
const cors = require('cors')
const app = express()
const connectDB = require('./database/connection');
// dns
const dns = require('dns');
dns.setServers(['8.8.8.8','1.1.1.1']);


connectDB()

app.use(express.json())
app.use (express.urlencoded({extended: true}))




const authRoutes = require('./routes/authRoute');
app.use('/api/auth', authRoutes);









app.get("/", (req,res)=>{
    res.send("Project chaliraxa")
})






















// Project
app.listen(3000, ()=>{

console.log('Server is running on port 3000')
})