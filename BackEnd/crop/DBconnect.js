const mongoose=require("mongoose");
const dbURI="mongodb+srv://Pratusha:Pratusha1998@cluster0.38wpw.mongodb.net/CROP?retryWrites=true&w=majority";

function connect(){
    return new Promise((resolve,reject)=>{
        mongoose.connect(dbURI,{useNewUrlParser:true,
            useUnifiedTopology:true,
            useCreateIndex:true,
            useFindAndModify:true
        }).then((res,err)=>{
            if (err) return reject(err);
            resolve();
        }) 
    })
}

function close(){
    return mongoose.disconnect();
}

module.exports={ connect, close };