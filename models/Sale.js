const mongoose= require('mongoose');
const { Schema } = mongoose;
const SaleSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    unitname:{
        type: mongoose.Schema.Types.String,
        ref:'user'
    },
    productdetails:{
        type: String,
        required:true,
    },
    saleamount:{
        type: Number,
        required:true,
    },
    date:{
        type: Date,
        default:Date.now
    },
  });

  module.exports=mongoose.model('sale',SaleSchema);