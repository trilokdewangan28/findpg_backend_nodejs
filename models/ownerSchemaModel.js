const mongoose = require('mongoose');

const ownerCollection = 'ownercollections';
const guestRatingSchema = new mongoose.Schema({
    guestEmail:{type:String, required:true},
    guestName:{type:String,},
    rated:{type:Boolean, default:false},
    feedback:{type:String},
    rate:{type:Number, default:0, required:true}
},{ _id: false });
const guestNameListSchema = new mongoose.Schema({
    guestEmail:{type:String},
    guestFullName:{type:String}
},
{ _id: false }
);
const ownerSchema = new mongoose.Schema({
    email:{type:String, required:true, },
    password:{type:String, required:true},
    hostleName:{type:String, required:true},
    totalBed:{type:Number,required:true},
    contactNo:{type:Number, required:true},
    city:{type:String,required:true},
    mapAddressUrl:{type:String},
    address:{type:String, required:true},
    pincode:{type:Number, required:true},
    selectedUserCategory:{type:String, required:true},
    selectedHostleCategory:{type:String, required:true},
    profilePic:{type:String},
    ownerHostlePic:[
        {type:String}
    ],
    verifiedEmail:{type:Boolean,default:false},
    bookedCount:{type:Number, default:0},
    availableBed:{type:Number},
    likedCount:{type:Number,default:0},
    guestNameList:[guestNameListSchema],
    rateByGuest:[guestRatingSchema],
    averageRating:{type:Number, default:0}
});

const OwnerSchemaModel = mongoose.model(ownerCollection,ownerSchema);

module.exports = OwnerSchemaModel;