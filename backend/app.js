const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express')
const cors = require('cors')
const app = express()
const connectDB = require('./database/connection');
// dns
const dns = require('dns');
dns.setServers(['8.8.8.8','1.1.1.1']);

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.sendStatus(204);
  }
  next();
});

connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const authRoutes = require("./routes/auth/authRoutes")
const productRoutes = require("./routes/admin/product/productRoutes")
const profileRoutes = require("./routes/user/myProfile/profileRoutes")
const globalRoutes = require("./routes/global/globalRoutes")
const cartRoutes = require("./routes/user/myProfile/cart/cartRoutes")
const orderUserRoutes = require("./routes/user/myProfile/order/orderRoutes")
const reviewRoutes = require("./routes/user/myProfile/review/reviewRoutes")

// Using Routes here
app.use("/api/admin/product", productRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/user",profileRoutes)
app.use("/api/globals", globalRoutes)
app.use("/api/user/cart", cartRoutes)
app.use("/api/user", orderUserRoutes)
app.use("/api/user/review", reviewRoutes)











app.get("/", (req,res)=>{
    res.send("Project chaliraxa")
})





require('dotenv').config()
















// Project
const port = process.env.PORT || 3000
app.listen(3000, ()=>{

console.log('Server is running on port 3000')
})