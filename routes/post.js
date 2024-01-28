const mongoose= require( "mongoose");

const postschema = mongoose.Schema({

  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref : "user",
  },

  title:String,
  discription:String,
  img:String,
 
 
});

module.exports = mongoose.model("post",postschema);