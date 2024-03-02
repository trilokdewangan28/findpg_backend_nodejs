const mongoose = require('mongoose');

const rateCollection = 'ratecollection';
const guestSchema = new mongoose.Schema({
    guestEmail:{type:String},
    rate:{type:Number, default:0}
},{ _id: false });
const rateSchema = new mongoose.Schema({
    ownerEmail:{type:String, required:true},
    totalAverageRate:{type:Number},
    guest:[guestSchema]

});

const RateSchemaModel = mongoose.model(rateCollection,rateSchema);

module.exports = RateSchemaModel;