require('dotenv').config()
const express=require('express')
const cors=require('cors')
const mongoose=require('mongoose')
const cookieParser=require("cookie-parser")
const bodyParser=require("body-parser")
const ErrorHandler=require("./middleware/error")
const cloudinary = require("cloudinary");
const app=express()

app.use(cors({
  origin:"http://localhost:3000",
  credentials:true
}))
app.use(express.json({ limit: '10mb' })); 
app.use(cookieParser())
app.use("/",express.static("uploads"))
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

//Connect dataBase
mongoose.connect(process.env.MONGODB_URL)

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

//import routes
const user = require("./controllers/user");
const shop = require("./controllers/shop");
const product = require("./controllers/product");
const event = require("./controllers/event");
const coupon = require("./controllers/coupounCode");
const payment = require("./controllers/payment");
const order = require("./controllers/order");
const conversation = require("./controllers/conversation");
const message = require("./controllers/message");
const withdraw = require("./controllers/withdraw");

app.use("/api/v2/user", user);
app.use("/api/v2/conversation", conversation);
app.use("/api/v2/message", message);
app.use("/api/v2/order", order);
app.use("/api/v2/shop", shop);
app.use("/api/v2/product", product);
app.use("/api/v2/event", event);
app.use("/api/v2/coupon", coupon);
app.use("/api/v2/payment", payment);
app.use("/api/v2/withdraw", withdraw);


 app.use(ErrorHandler)

// unhandled promise rejection
process.on("unhandledRejection", (err) => {
    console.log(`Shutting down the server for ${err.message}`);
    console.log(`shutting down the server for unhandle promise rejection`);
  
    server.close(() => {
    process.exit(1);
    });
  });
  app.all("*",(req,res)=>{
    return res.status(404).json({message:`Route ${req.originalUrl} not found`})
  })

  const server=app.listen(process.env.PORT,()=>{
    console.log(`Server is Running on PORT ${process.env.PORT}`)
})