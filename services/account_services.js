const AccountSchemaModel = require('../models/accountSchemaModel');
const GuestSchemaModel = require('../models/guestSchemaModel');
const mailer = require('../middleware/mailer');
const randomstring = require('randomstring');
const NodeCache = require('node-cache');
const otpCache = new NodeCache();

async function sendOtp(email){
  try{
    
    const otp = randomstring.generate({
      length: 6,
      charset: 'numeric',
    });

    const expirationTime = Date.now() + 10 * 60 * 1000; // 10 minutes from now
    
    otpCache.set(email, { otp, expirationTime });

    const otpData = otpCache.get(email);

    console.log(otpData.otp);
    console.log(otpData.expirationTime);
    
    //-------------------sending the email-----------------
    
    const result = mailer.sendEmail(email, 'otp for manage transactions', `Your OTP is: ${otp}`);
    if (!result) {
      console.log('some error occured while sending verification email');
      return {
        success: false,
        message: 'unable to send mail',
      };
    } else {
      console.log('successfully sent Otp to the guest email');
      return {
        success: true,
        message: 'otp sent successfully to the guest email'
      };

    } 

  }catch(err){
     console.log('something went wrong inside service while sending verification email');
     console.log(err.message);
     return {
      success:false,
      message:'something went wrong while sending verification email'
     }
  }
}

async function markedAsPaid(model) {
  try {
    const incomingOwnerEmail = model.ownerEmail;
    const incomingGuestEmail = model.guestEmail;
    const incomingYear = model.year;
    const incomingMonth = model.month;
    const paidStatus = model.paidStatus;
    const userEnteredOtp=model.userEnteredOtp;

    const newAccountData = {
      ownerEmail: incomingOwnerEmail,
      guests: [
        {
          guestEmail: incomingGuestEmail,
          years: [
            {
              year: incomingYear,
              months: [
                  {
                    month:incomingMonth,
                    paid:paidStatus
                  }
              ]
              }
          ]
        }
      ]
    };

    const otpData = otpCache.get(incomingGuestEmail);
    console.log(otpData.otp);
  
    if (otpData.otp === userEnteredOtp) {
      const currentTime = Date.now();
  
      console.log('valid otp');
      if (currentTime <= otpData.expirationTime) {

        const owner = await AccountSchemaModel.findOne({ownerEmail:incomingOwnerEmail});
    if(owner){
      console.log('owner finded');
      const guest = await AccountSchemaModel.findOne({ownerEmail:incomingOwnerEmail, 'guests.guestEmail':incomingGuestEmail});
      if(guest){
        console.log('guest and owner found');
        const year = await AccountSchemaModel.findOne({ownerEmail:incomingOwnerEmail,'guests.guestEmail':incomingGuestEmail ,'guests.years.year':incomingYear});
        if(year){
          console.log('guest,owner,year found');
          const month = await AccountSchemaModel.findOne({ownerEmail:incomingOwnerEmail,'guests.guestEmail':incomingGuestEmail,'guests.years.year':incomingYear, 'guests.years.months.month':incomingMonth});
          if(month){
            console.log('guest,owner,year,month founded');
            const result = await AccountSchemaModel.findOneAndUpdate(
              {ownerEmail:incomingOwnerEmail,'guests.guestEmail':incomingGuestEmail,'guests.years.year':incomingYear,'guests.years.months.month':incomingMonth},
              {
                $set: {
                  'guests.$[guestElem].years.$[yearElem].months.$[monthElem].paid': paidStatus,
                },
              },
              {
                arrayFilters: [
                  { 'guestElem.guestEmail': incomingGuestEmail },
                  { 'yearElem.year': incomingYear },
                  { 'monthElem.month': incomingMonth },
                ],
                new: true, // To return the updated document
              }
            );
            if(result){
              console.log('marked paid for existing record');
              otpCache.del(incomingGuestEmail);
              return {
                success:true,
                message:'marked paid successfully'
              }
            }else{
              console.log('marked paid failed for existing record');
              otpCache.del(incomingGuestEmail);
              return {
                success:false,
                message:'marked paid failed'
              }
            }
          }else{
            const newMonthData = {
              month:incomingMonth,
              paid:paidStatus
            };
            const result = await AccountSchemaModel.findOneAndUpdate(
              {ownerEmail:incomingOwnerEmail,'guests.guestEmail':incomingGuestEmail,'guests.years.year':incomingYear,},
              {
                $push: {
                  'guests.$[guest].years.$[year].months': newMonthData
                }
              },
              {
                arrayFilters: [
                  { 'guest.guestEmail': incomingGuestEmail },
                  { 'year.year': incomingYear }
                ]
              }
              )
              if(result){
                console.log('marked paid for new month');
                otpCache.del(incomingGuestEmail);
                return{
                  success:true,
                  message:'marked paid successfully'
                }
              }else{
                console.log('marked paid failed for new month with existed owner guest year');
                otpCache.del(incomingGuestEmail);
                return {
                  success:false,
                  message:'marked paid failed'
                }
              }
          }
        }else{
          const newYearData = {
            year: incomingYear,
            months: [
                {
                  month:incomingMonth,
                  paid:paidStatus
                }
            ]
          };
          const result = await AccountSchemaModel.findOneAndUpdate(
            {ownerEmail:incomingOwnerEmail, 'guests.guestEmail':incomingGuestEmail},
            {$push:{'guests.$.years':newYearData}}
          );
          if(result){
            console.log('marked paid for new year value for existed owner and guest');
            otpCache.del(incomingGuestEmail);
            return {
              success:true,
              message:'marked paid successfully'
            }
          }else{
            console.log('marked paid failed for new year value for existed owner and guest');
            otpCache.del(incomingGuestEmail);
            return {
              success:false,
              message:'marked paid failed'
            }
          }

        }
      }else{
        const newGuestData = {
          guestEmail: incomingGuestEmail,
          years: [
            {
              year: incomingYear,
              months: [
                  {
                    month:incomingMonth,
                    paid:paidStatus
                  }
              ]
              }
          ]
        };
        const result = await AccountSchemaModel.findOneAndUpdate(
          {ownerEmail:incomingOwnerEmail},
          {$push:{guests:newGuestData}}
          );
          if(result){
            console.log('new guest account marked for existing owner');
            otpCache.del(incomingGuestEmail);
            return {
              success:true,
              message:'marked paid successfully'
            }
          }else{
            console.log('marked paid failed for new guest for existing owner');
            otpCache.del(incomingGuestEmail);
            return {
              success:false,
              message:'marked paid failed'
            }
          }
      }

    }else{
      const newAccount = await AccountSchemaModel(newAccountData);
      const result = await newAccount.save();
      if(result){
        console.log('marked paid successfully');
        otpCache.del(incomingGuestEmail);
        return {
          success:true,
          message:'marked as paid'
        }
      }else{
        console.log('marking paid are failed for new owner');
        otpCache.del(incomingGuestEmail);
        return {
          success:false,
          message:'marked paid failed'
        }
      }
    }
       
      }else{
        console.log('otp expired');
        otpCache.del(incomingGuestEmail);
        return {
          success:false,
          message:'otp expired! please try again'
        }
      }
  
    }else{
      console.log('invalid otp');
      return {
        success:false,
        message:'invalid otp! please enter correct otp'
      }
    } 

  } catch (err) {
    console.log('Something went wrong while marking as paid');
    console.log(err.message);
    console.log(err);
    return { success: false, message: 'Something went wrong while marking as paid' };
  }
}



async function fetchPaymentRecord(model){

  try{
    const result = await AccountSchemaModel.findOne({ownerEmail:model.ownerEmail, 'guests.guestEmail':model.guestEmail});
    if(result){
      return{
        success:true,
        message:'payment record fetched',
        result:result
      }
    }else{
      return {
        success:false,
        message:'failed to fetch payment record',
        result:null
      }
    }
  }catch(err){
    return {
      success:false,
      message:'internal server error',
      result:null
    }
  }
}

async function removeGuest(model){
  try{


    const existingGuest = await AccountSchemaModel.findOne({
      ownerEmail: model.ownerEmail,
      'guests.guestEmail': model.guestEmail
    });

    if (!existingGuest) {
      console.log('Guest not found');
      return {
        success: false,
        message: 'Guest not found'
      };
    }

    
    const result = await AccountSchemaModel.findOneAndUpdate(
      { ownerEmail: model.ownerEmail },
      {
        $pull: { guests: { guestEmail: model.guestEmail } }
      },
      { new: true }
    );

    console.log('updated result',result);
    if(result){
      console.log('guest removed successfully');
      return {
        success:true,
        message:'guest removed successfully'
      }
    }else{
      console.log('guest not removed');
      return {
        success:false,
        message:'guest not removed'
      }
    }
  }catch(err){
    console.log('some error occured');
    console.log(err.message);
    return {
       success:false,
       message:'internal server error in service'
    }
  }

}


module.exports = { markedAsPaid, fetchPaymentRecord, sendOtp, removeGuest }



// [
//   {
//     ownerEmail:'owner1@gmail.com',
//     guests:[
//       {
//         guestEmail:'guest1@gmail.com',
//         year:2000
//       },
//       {
//         guestEmail:'guest2@gmail.com',
//         y
//       }
//     ]
//   }
// ]