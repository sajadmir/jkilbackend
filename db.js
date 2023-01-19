
const mongoose= require('mongoose');
const mongoURI= process.env.DATABASE 
const connectToMongo=()=>{
mongoose.connect(mongoURI,()=>{
    console.log("Connected to mongo DB Successfully");
    console.log(process.env.DATABASE)
    
})

}

module.exports=connectToMongo;