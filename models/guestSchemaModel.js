const mongoose = require('mongoose');

const guestCollection = 'guestcollections';
const guestSchema = new mongoose.Schema({
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    fname: {type:String, required:true},
    lname:{type:String,  required:true},
    contactNo:{type:Number, required:true},
    adharNo: {type:Number, required:true},
    profession:{type:String, required:true},
    clgName:{type:String, required:true},
    city:{type:String, required:true},
    address:{type:String, required:true},
    mapAddressUrl:{type:String},
    pincode:{type:Number, required:true},
    selectedUserCategory:{type:String, required:true},
    profilePic:{type:String},
    verifiedEmail:{type: Boolean, default:false},
    bookedTo:{type:String,default:""},
    bookedHostleName:{type:String},
    joinedDate:{type:Date},
    bookedStatus:{type:Boolean, default:false},
    likedTo:[{type:String}],
});

const GuestSchemaModel = mongoose.model(guestCollection,guestSchema);
module.exports = GuestSchemaModel;
