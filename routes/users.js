const mongoose= require( "mongoose");
const plm =require("passport-local-mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/pin") 


const userschema =mongoose.Schema({

  username:String,
  number:Number,
  name:String,
  email:String,
  password:String,
  profileimg:String,
  bords:{
    type:Array,
    default:[]
  },
  post:[{
    type:mongoose.Schema.Types.ObjectId,
    ref : "post",

 }]
 
})
userschema.plugin(plm);
module.exports = mongoose.model("user",userschema);