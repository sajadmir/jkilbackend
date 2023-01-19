
const mongoose= require('mongoose');
//const mongoURI= process.env.DATABASE || "mongodb://127.0.0.1:27017/jkil?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false"
const mongoURI= process.env.DATABASE || "mongodb+srv://sajadmir38:pc141005@cluster0.0vbx3an.mongodb.net/jkil?retryWrites=true&w=majority"
const connectToMongo=()=>{
mongoose.connect(mongoURI,()=>{
    console.log("Connected to mongo DB Successfully");
    //console.log(process.env.DATABASE)
    
})

}

module.exports=connectToMongo;