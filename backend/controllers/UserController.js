const User=require("../models/userModel")
const validator=require("validator")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const nodemailer=require("nodemailer")

const createToken=(_id)=>{
    return jwt.sign({_id},process.env.SECRET,{expiresIn:'1d'})
}
//Signing up users
const signupUser=async(req,res)=>{
const {name,email,password}=req.body //The values collected from the request body/frontend
if (!email || !password || !name) {  //if any or the 3 fields is/are left blank
    return res.status(400).json("All field must be filled")
}
if (!validator.isEmail(email)) {
    return res.status(400).json("Invalid email format")
}
if (!validator.isStrongPassword(password)) {
    return res.status(400).json("Password not strong enough")
}
const existingEmail=await User.findOne({email}) //Checks if the email is in our database
if (existingEmail) {
    return res.status(400).json({error:"Email already in use"})
}

try {
    const salt=await bcrypt.genSalt(10) //random values(10) that adds additional complexity to the hashing process
    const hash=await bcrypt.hash(password,salt) //hash the password collected from the user and adds the salt value to increase its complexity
    const user=await User.create({email,password:hash}) //Creates a user with the provided email and the hashed value of the password
    const token=createToken(user._id)
    res.status(200).json({email,token})//This json executes if everything goes fine in this try block(sends back the entered email and the generated jwt token as response)
} catch (error) {
    res.status(400).json({error:error.message})
}
}
//logging in users
const loginUser=async(req,res)=>{
    const {email,password}=req.body //The values collected from the request body/frontend
    if (!email || !password) { //If a field or both is left empty, it'll return this message and won't proceed to the next function
        return res.status(400).json("All fields must be filled")
    }
    if (!validator.isEmail(email)) {  //Checks if the email entered is valid or not
        return res.status(400).json("Invalid email format")      
    }
    if (!validator.isStrongPassword(password)) { //Checks if the password entered is strong enough or not
        return res.status(400).json("Password is not strong enough")
    }
    const user=await User.findOne({email}) //Checks if the email is in our database
if (!user) {  //if the email is not, it returns this message
    return res.status(400).json("Email not recognised")
}
//Compares the entered password with the password in the database
const match=await bcrypt.compare(password,user.password)
if (!match) {
    return res.status(400).json("Incorrect password")
}
const token=createToken(user._id)
res.status(200).json({email,token}) //This json executes if everything goes fine in this try block(sends back the entered email and the generated jwt token as response)
}

const forgottenPassword=async(req,res)=>{
const {email}=req.body
const user=await User.findOne({email:email})
if (!user) {
    return res.status(400).json("No Such User")
}
try {
    const token=createToken(user._id)
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });
    
    var mailOptions = {
      from: 'youremail@gmail.com',
      to: 'myfriend@yahoo.com',
      subject: 'Reset your password',
      text:`http://localhost:3000/forgottenPassword/${user_.id}/${token}`
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
return res.status(200).json("Successfully sent")
    }
    }); 
} catch (error) {
    
}
}

module.exports={signupUser,loginUser,forgottenPassword}