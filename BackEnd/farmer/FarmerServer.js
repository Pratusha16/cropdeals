//import libraries
// const http=require("http");
const express=require("express");
const mongoose=require("mongoose");
const morgan=require("morgan")
const bodyParser=require("body-parser")
const cors=require("cors");
// const bcrypt =require ("bcrypt");
const jwt=require("jsonwebtoken");
const code=require("./farmersCore");
// const axios=require("axios");
//importing schema
// const farmerschema=require("./FarmerSchema");
const { secretKey } = require("./config");
// const adminurl="http://localhost:2000/";
// const farmerurl="http://localhost:5000/";
// const dealerurl="http://localhost:7000/";
// const cropurl="http://localhost:8000/"

const app=express();
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
app.use(morgan("dev"));

// app.js
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'Express API for JSONPlaceholder',
      version: '1.0.0',
      description:
        'This is a REST API application made with Express. It retrieves data from JSONPlaceholder.',
      license: {
        name: 'Licensed Under MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'JSONPlaceholder',
        url: 'https://jsonplaceholder.typicode.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
  };

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['FarmerServer.js'],
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//for browsers only setting headers
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
        console.log(token);
        const decoded=jwt.verify(token,secretKey);
        req.userdata=decoded;
        next();
    } catch(error){
        return res.status(401).json({
            message:"UNAUTHORISED!",
            error:error
        })
    }
}

//connecting to database
const dbURI="mongodb+srv://Pratusha:Pratusha1998@cluster0.38wpw.mongodb.net/FARMER?retryWrites=true&w=majority";
mongoose.connect(dbURI,{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true})
.then(()=>{
    console.log("farmer database connected")
}).catch((err)=>{
    console.log("db connection error:" + err);
});

// Api Endpoints

/**
 * @swagger
 * /farmers:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder farmers
 *     description: Retrieve a list of farmers from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
*/
//getting all data
app.get("/farmers",CheckAuth,code.farmers_get_all)



// fetch particular farmer details with name
app.get('/farmers/:id',CheckAuth,code.farmers_get_by_id);

/**
 * @swagger
 * /farmers:
 * post:
 * discription: farmers_login
 * parameters:
 * -name:String
 * email:String
 * password:String
 * responses:
 * 200:
 * description:Success
 */

// login dealer user
app.post("/login",code.farmers_login);

/**
 * @swagger
 * /farmers:
 * post:
 * discription: farmers_register
 * parameters:
 * -name:String
 * email:String
 * password:String
 * contact:Number
 *  gender:String
 *  cropsgrown:Array
 * bank_details:bank
 * responses:
 * 200:
 * description:Success
 */

//registering new farmer details
app.post("/register",code.farmers_register)  

/**
 * @swagger
 * /farmers:
 * put:
 * discription: farmers_get_by_id
 * parameters:
 * -name:String
 * email:String
 * password:String
 * responses:
 * 200:
 * description:Success
 */

//updating a particular crop
app.put("/farmers/:id",CheckAuth,code.farmers_edit_by_id)

/**
 * @swagger
 * /farmers:
 * delete:
 * discription: farmers_get_by_id
 * parameters:
 * -name:String
 * email:String
 * password:String
 * responses:
 * 200:
 * description:Success
 */

//deleteing particular crop
app.delete('/farmers/:id',CheckAuth,code.farmers_delete_by_id)

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

// get calls from server
app.listen("5000",()=>console.log("farmer server is running on 5000"))
