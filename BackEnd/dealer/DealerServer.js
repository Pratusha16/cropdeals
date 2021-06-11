//import libraries
const http=require("http");
const express=require("express");
const mongoose=require("mongoose");
const morgan=require("morgan")
const bodyParser=require("body-parser")
const cors=require("cors");
const bcrypt =require ("bcrypt");
const jwt=require("jsonwebtoken");
const code=require("./dealersCore")

const app=express();
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
app.use(morgan("dev"));

const swaggerJsdoc=require("swagger-jsdoc");
const swaggerUi=require("swagger-ui-express");
//swagger 
const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "CASE STUDY Dealer API with Swagger",
        version: "0.1.0",
        description:
          "This is a simple CRUD API application made with Express and documented with Swagger",
      },
      servers: [
        {
          url: "http://localhost:7000",
        },
      ],
    },
    apis: ["DealerServer.js"],
  };
 //require("../../BackEnd/crop/CropServer")
  const specs = swaggerJsdoc(options);
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs,{ explorer: true })
  );

  console.log(specs);


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

/**
 * @swagger
 * components:
 *   schemas:
 *      Dealer:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - role
 *         
 *       properties:
 *         
 *         name:
 *           type: string
 *           description: The dealer name
 *         email:
 *           type: string
 *           description: The dealer name    
 *         password:
 *           type: string
 *           description: password of dealer
 *         role:
 *            type:string
 *            description: role of a person
 *
 *       example:
 *         
 *         name: pratusha
 *         email : "pratusha@gmail.com"
 *         password: "pratusha@6"
 *         role:"dealer"
 *        
 */


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
            message:"Auth failed in middleware"
        })
    }
}

//connecting to database
const dbURI="mongodb+srv://Pratusha:Pratusha1998@cluster0.38wpw.mongodb.net/DEALER?retryWrites=true&w=majority";
mongoose.connect(dbURI,{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true})
.then(()=>{
    console.log("dealer database connected")
})
.catch((err)=>{
    console.log("db connection error:" + err);
});

//importing schema
//const dealerschema=require("./DealerSchema");
const { secretKey } = require("./config");

// Api methods

/**
 * @swagger
 * /dealers:
 *   get:
 *    discription: Get dealers with check_auth
 *    parameters:
 *      - name: 
 *        description: name
 *        required: true
 *        type: String
 *    responses:
 *      '200':
 *       description:Success
 *   /ping:
 *     get:
 *       summary: Checks if the server is running
 *       security: []   # No security
 *       responses:
 *         '200':
 *           description: Server is up and running
 *         default:
 *           description: Something is wrong
 */


//getting all delaer data
app.get("/dealers",CheckAuth,code.dealers_get_all)


// fetch particular dealer details with name
app.get('/dealers/:id',CheckAuth,code.dealers_get_by_id)

/**
 * @swagger
 * /register:
 *   post:
 *     summary: register a new dealer
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Dealer'
 *     responses:
 *       200:
 *         description: The DEALER was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dealer'
 *       500:
 *         description: Some server error
 */

//register new dealer
app.post("/register",code.dealers_register) 

/**
 * @swagger
 * /login:
 *   post:
 *    discription: login dealer
 *    components:
 *      securitySchemes:
 *        BearerAuth:
 *          type: http
 *          scheme: bearer
 *    parameters:
 *      - name: 
 *        description: name
 *        required: true
 *        type: String
 *      - email: 
 *        description: email
 *        required: true
 *        type: String
 *      - password: 
 *        description: password
 *        required: true
 *        type: String
 *    responses:
 *      '200':
 *       description:Success
 *   /ping:
 *     get:
 *       summary: Checks if the server is running
 *       security: []   # No security
 *       responses:
 *         '200':
 *           description: Server is up and running
 *         default:
 *           description: Something is wrong
 */
    
// login to existing dealer user
app.post("/login",code.dealers_login)

/**
 * @swagger
 * /dealer:
 *   put:
 *    discription: Get dealer edit by id
 *    parameters:
 *      - name: 
 *        description: name
 *        required: true
 *        type: String
 *    responses:
 *      '200':
 *       description:Success
 *   /ping:
 *     get:
 *       summary: Checks if the server is running
 *       security: []   # No security
 *       responses:
 *         '200':
 *           description: Server is up and running
 *         default:
 *           description: Something is wrong
 */

//editing a particular dealer details
app.put("/dealers/:id",CheckAuth,code.dealers_edit_by_id)

/**
 * @swagger
 * /dealers:
 *   put:
 *    discription: Get dealers deleted by id
 *    parameters:
 *      - name: 
 *        description: name
 *        required: true
 *        type: String
 *    responses:
 *      '200':
 *       description:Success
 *   /ping:
 *     get:
 *       summary: Checks if the server is running
 *       security: []   # No security
 *       responses:
 *         '200':
 *           description: Server is up and running
 *         default:
 *           description: Something is wrong
 */

//deleteing particular dealer
app.delete('/dealers/:id',CheckAuth,code.dealers_delete_by_id)

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

var dealer=app.listen("7000",()=>console.log("dealer server is running on 7000"))

module.exports=dealer;