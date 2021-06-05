//import libraries
const express=require("express");
const mongoose=require("mongoose");
const morgan=require("morgan")
const bodyParser=require("body-parser")
const cors=require("cors");
const bcrypt =require ("bcrypt");
const jwt=require("jsonwebtoken");
const core=require("./adminCore");
const axios=require("axios");
const { token } = require("morgan");
const { secretKey } = require("./config");
const farmerurl="http://localhost:5000/";
const dealerurl="http://localhost:7000/"
const cropurl="http://localhost:8000/"

const app=express();
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
app.use(morgan("dev"));

//for browsers only
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin",'*');
    res.header("Access-Control-Allow-Headers",
    'Origin,X-Requested-With,Content-Type,Accept,Authorization');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({})
    }
    next();
})
//checking Authorization in middleware
const CheckAuth=(req,res,next)=>{
    try{
        const token =req.headers.authorization.split(" ")[1];
    const decoded=jwt.verify(token,secretKey);
    req.userdata=decoded;
    next();
    } catch(error){
        return res.status(401).json({
            message:"Auth failed in middleware"
        })
    }
}

//connecting to database
const dbURI="mongodb+srv://Pratusha:Pratusha1998@cluster0.38wpw.mongodb.net/CropdealADMIN?retryWrites=true&w=majority";
mongoose.connect(dbURI,{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true})
.then(()=>{
    console.log("admin database connected")
})
.catch((err)=>{
    console.log("db connection error:" + err);
});


/**
 * @swagger
 * /admin:
 * get:
 * discription: Get admin check_auth
 * responses:
 * 200:
 * description:Success
 */
//get all details
app.get("/admin",CheckAuth,core.get_admins);

/**
 * @swagger
 * /admin:
 * post:
 * discription: admin_login
 * parameters:
 * -name:String
 * email:String
 * password:String
 * responses:
 * 200:
 * description:Success
 */

// login dealer user
app.post("/login",core.admin_login);

/**
 * @swagger
 * /admin:
 * post:
 * discription:  admin_registration
 * parameters:
 * -name:String
 * email:String
 * password:String
 * contact:number
 * gender:String
 * responses:
 * 200:
 * description:Success
 */

//register new dealer
app.post('/register',core.admin_register);

/**
 * @swagger
 * /admin:
 * post:
 * discription: admin_edit
 * parameters:
 * -name:String
 * email:String
 * password:String
 * responses:
 * 200:
 * description:Success
 */

//edit admin deatils
app.put("/:id",CheckAuth,core.admin_edit_by_id);

/**
 * @swagger
 * /admin:
 * post:
 * discription: admin_delete
 * parameters:
 * -name:String
 * email:String
 * password:String
 * responses:
 * 200:
 * description:Success
 */


//delete admin details
app.delete("/:id",CheckAuth,core.admin_delete_by_id)

//handing server errors
app.use((req,res,next)=>{
    const error=new Error("Not found");
    error.status=404;
    next(error);
})

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message:error.message
        }
    })
})

app.listen("2000",()=>console.log("admin server is running on 2000"))