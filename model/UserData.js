const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
    username:{type:String, required:true, lowercase: true},
    email:{type:String, required:true, lowercase: true},
    phone:{type:Number, required:true},
    password:{type:String, required:true}
},{timestamps:true, versionKey:false});

module.exports = mongoose.model("user", userSchema);