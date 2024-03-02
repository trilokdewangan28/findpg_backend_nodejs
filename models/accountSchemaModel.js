const mongoose = require('mongoose');

const monthSchema = new mongoose.Schema({
  month:{type:String},
  paid:{type:Boolean}
}, { _id: false });

const yearSchema = new mongoose.Schema({
  year: {
    type: String,
    required: true
  },
  months: [monthSchema]
},{ _id: false });

const guestSchema = new mongoose.Schema({
  guestEmail: {
    type: String,
    required: true
  },
  years: [yearSchema]
},{ _id: false });

const ownerGuestSchema = new mongoose.Schema({
  ownerEmail: {
    type: String,
    required: true
  },
  guests: [guestSchema]
});

const AccountSchemaModel = mongoose.model('accounts', ownerGuestSchema);

module.exports = AccountSchemaModel;