const GuestSchemaModel = require('../models/guestSchemaModel');
const OwnerSchemaModel = require('../models/ownerSchemaModel');
const AccountSchemaModel= require('../models/accountSchemaModel');
const mailer = require('../middleware/mailer');
const randomstring = require('randomstring');
const NodeCache = require('node-cache');
const otpCache = new NodeCache();
const mongoose = require('mongoose');


//-----------------------------------------------------------FETCH HOSTLE SERVICE--------------------------------------------
async function fetchHostle(callback) {
  try {
    const result = await OwnerSchemaModel.find({verifiedEmail:true},' -password -selectedUserCategory -profilePic');
    if(result){
      const userList = result.map(owner => owner.user);
      console.log(userList);
      console.log(result);
      return {
        success:true,
        message:'successfully hostle list fetched',
        result:result
      }
    }else{
      return {
      success:false,
      message:'failed to fetch hostle list'
      }
    }
  } catch (err) {
    return {
      success:false,
      message:'error occured while fetching hostle list'
    }
  }
}

//---------------------------------------------------------------BOOK HOSTLE SERVICE-----------------------------------------
async function bookHostle(model){
  try{
     
    const book = await GuestSchemaModel.findOne({email:model.guestEmail}).select('bookedTo bookedStatus fname lname');
    const guestFullName = book.fname+" "+book.lname;
    console.log(book);
    if(book.bookedTo != model.ownerEmail && book.bookedStatus != true){


      const totalBedResult = await OwnerSchemaModel.findOne({ email: model.ownerEmail }).select('totalBed');
      const totalBed= totalBedResult.totalBed; // total no. of bed
      console.log('total bed is: '+totalBed);

      const bookedCountResult = await OwnerSchemaModel.findOne({ email: model.ownerEmail }).select('bookedCount');
      var bookedCount = bookedCountResult.bookedCount;// total no. of booked count for owner
      console.log('bookedCount is : '+bookedCount);
      bookedCount = bookedCount+1;
      
      if(bookedCount<=totalBed){
        const bookedResultGuest = await GuestSchemaModel.findOneAndUpdate({email:model.guestEmail},{bookedTo:model.ownerEmail, bookedStatus:model.bookedStatus, bookedHostleName:model.bookedHostleName});
        const bookedResultOwner = await OwnerSchemaModel.findOneAndUpdate(
          {email:model.ownerEmail},
          {
           $push: { bookedBy: model.guestEmail, bookedGuestName:guestFullName},
           $set:{[`guestNameList.${model.guestEmail}`]:guestFullName},
           bookedCount: parseInt(bookedCount)
          },
          { new: true }
        );
        let ownerBed = await OwnerSchemaModel.findOne({email:model.ownerEmail}).select('totalBed bookedCount');
         if(!ownerBed){
          console.log('error finding owner bed status');
          return {
            success:false,
            message:'error finding owner bed status'
          }
        }
        const totalBed = parseInt(ownerBed.totalBed);
        const bookedCount = parseInt(ownerBed.bookedCount);
        const availableBed=totalBed - bookedCount;
        console.log('total bed is'+totalBed);
        console.log('booked count is '+bookedCount);
        console.log('available bed is'+availableBed);
        const updateBedResult = await OwnerSchemaModel.findOneAndUpdate(
          {email:model.ownerEmail},
          {availableBed:parseInt(availableBed)}
          );
        if(!updateBedResult){
          console.log('error updating bed status');
          return {
            success:false,
            message:'error updating bed status'
          }
        }
        console.log('owner booked result');
        console.log(bookedResultOwner);
        console.log('guest booked result');
        console.log(bookedResultGuest);
        return {
          success:true,
          message:'booked successfully'
        }
      }else{
        console.log('no sufficient bed');
        return {
          success:false,
          message:'no sufficient bed'
        }
      }
      
    }else{
      console.log('already booked');
      return {
        success:false,
        message:'already booked '
      }
    }
    

  }catch(err){
    console.log('error occured in services while booking the hostle');
    console.log(err.message);
    return {
      success:false,
      message:'Internal server error'
    }
  }
}


//---------------------------------------------------------------UNBOOK HOSTLE SERVICE---------------------------------------
async function unBookHostle(model){
  try{
     
    const book = await GuestSchemaModel.findOne({email:model.guestEmail}).select('bookedTo bookedStatus fname lname');
    console.log(book);
    if(book.bookedTo == model.ownerEmail && book.bookedStatus == true){
      const updateBookedGuest=await GuestSchemaModel.findOneAndUpdate({email:model.guestEmail},{ $unset: { bookedTo: 1, bookedHostleName: 1 }, bookedStatus: model.bookedStatus },);
      if(!updateBookedGuest){
        console.log('error updating guest while unbook the hostle');
        return {
          success:false,
          message:'error updating guest while unbook the hostle'
        }
      }
      const ownerQuery = OwnerSchemaModel.findOne({ email: model.ownerEmail }).select('bookedCount');
      const owner = await ownerQuery.exec();
      console.log(owner);
      var bookedCount1 = owner.bookedCount;
      console.log(bookedCount); // Output the value of bookedCount
      bookedCount1=bookedCount1-1;
      const bookedResultOwner = await OwnerSchemaModel.findOneAndUpdate(
        {email:model.ownerEmail},
        {
          $pull: { bookedBy: model.guestEmail},
          $unset: { [`guestNameList.${model.guestEmail}`]: "" },
          bookedCount: parseInt(bookedCount1)
        },
        { new: true }
      );
      if(!bookedResultOwner){
        console.log('error updating owner details while unbooking the hostel');
        return {
          success:false,
          message:'error updating owenr details while unbooking the hostel'
        }
      }
      let ownerBed = await OwnerSchemaModel.findOne({email:model.ownerEmail}).select('totalBed bookedCount');
         if(!ownerBed){
          console.log('error finding owner bed status');
          return {
            success:false,
            message:'error finding owner bed status'
          }
        }
        const totalBed = parseInt(ownerBed.totalBed);
        const bookedCount = parseInt(ownerBed.bookedCount);
        const availableBed=totalBed - bookedCount;
        console.log('total bed is'+totalBed);
        console.log('booked count is '+bookedCount);
        console.log('available bed is'+availableBed);
        const updateBedResult = await OwnerSchemaModel.findOneAndUpdate(
          {email:model.ownerEmail},
          {availableBed:parseInt(availableBed)}
          );
        if(!updateBedResult){
          console.log('error updating bed status');
          return {
            success:false,
            message:'error updating bed status'
          }
        }
      console.log('owner booked result');
      console.log(bookedResultOwner);
      console.log('guest booked result');
      console.log(updateBookedGuest);
      return {
        success:true,
        message:'unbooked successfully'
      }
    }else{
      console.log('already unbooked');
      return {
        success:false,
        message:'already unbooked '
      }
    }

  }catch(err){
    console.log('error occured in services while booking the hostle');
    console.log(err.message);
    return {
      success:false,
      message:'Internal server error'
    }
  }
}



//-------------------------------------------------------SEND MAIL FOR BOOK-----------------------------------------

async function sendOtpForBook(email){
  try{
    
    const otp = randomstring.generate({
      length: 6,
      charset: 'numeric',
    });

    const expirationTime = Date.now() + 5 * 60 * 1000; // 10 minutes from now
    
    otpCache.set(email, { otp, expirationTime });

    const otpData2 = otpCache.get(email);

    console.log(otpData2.otp);
    console.log(otpData2.expirationTime);
    
    //-------------------sending the email-----------------
    const result = mailer.sendEmail(email, 'otp for book your hostle, sent by guest', `Your OTP is: ${otp}`);
    if (!result) {
      console.log('some error occured while sending otp for booking');
      return {
        success: false,
        message: 'unable to send otp',
      };
    } else {
      console.log('successfully sent Otp to owner email');
      return {
        success: true,
        message: 'successfully sent Otp to owner email'
      };

    } 

  }catch(err){
     console.log('something went wrong inside service while sending booking otp');
     console.log(err.message);
     return {
      success:false,
      message:'something went wrong while sending booking otp'
     }
  }

}

//----------------------------------------------------------VERIFY THE OTP FOR BOOK--------------------------------
async function verifyOtpAndBook(model){
  try{
  const otpData2 = otpCache.get(model.ownerEmail);
  console.log(otpData2.otp);

  if (otpData2.otp === model.userEnteredOtp) {
    const currentTime = Date.now();

    console.log('valid otp');
    if (currentTime <= otpData2.expirationTime) {
      
      const book = await GuestSchemaModel.findOne({email:model.guestEmail}).select('bookedTo bookedStatus fname lname');
      const guestFullName = book.fname+" "+book.lname;
      console.log(book);
      if(book.bookedTo != model.ownerEmail && book.bookedStatus != true){


      const totalBedResult = await OwnerSchemaModel.findOne({ email: model.ownerEmail }).select('totalBed');
      const totalBed= totalBedResult.totalBed; // total no. of bed
      console.log('total bed is: '+totalBed);

      const bookedCountResult = await OwnerSchemaModel.findOne({ email: model.ownerEmail }).select('bookedCount');
      var bookedCount = bookedCountResult.bookedCount;// total no. of booked count for owner
      console.log('bookedCount is : '+bookedCount);
      bookedCount = bookedCount+1;
      
      if(bookedCount<=totalBed){
        const bookedResultGuest = await GuestSchemaModel.findOneAndUpdate({email:model.guestEmail},{bookedTo:model.ownerEmail, bookedStatus:model.bookedStatus, bookedHostleName:model.bookedHostleName, joinedDate:Date.now()});
        if(!bookedResultGuest){
          console.log('error updating guest while booking the hostel');
          return {
            success:false,
            message:'error updating guest while booking the hostel'
          }
        }
        const guestList = {
          guestEmail: model.guestEmail,
          guestFullName: guestFullName,
        };
        const bookedResultOwner = await OwnerSchemaModel.findOneAndUpdate(
          {email:model.ownerEmail},
          {
           $push: {guestNameList:guestList},
           bookedCount: parseInt(bookedCount)
          },
          { new: true }
          );
          if(!bookedResultOwner){
            console.log('error updating owner while booking the hostel');
            return {
              success:false,
              message:'error updating owner while booking the hostel'
            }
          }
          const newGuestData = {
            guestEmail: model.guestEmail,
            years: [
              {
                year: model.year,
                months: [
                    {
                      month:model.month,
                      paid:model.paidStatus
                    }
                ]
                }
            ]
          };
        const bookedGuestAccountResult = await AccountSchemaModel.findOneAndUpdate(
            {ownerEmail:model.ownerEmail},
            {$push:{guests:newGuestData}}
            );
        if(!bookedGuestAccountResult){
          console.log('error updating account while booking the hostel');
          return {
            success:false,
            message:'error updating account while booking the hostel'
          }
        }
        let ownerBed = await OwnerSchemaModel.findOne({email:model.ownerEmail}).select('totalBed bookedCount');
         if(!ownerBed){
          console.log('error finding owner bed status');
          return {
            success:false,
            message:'error finding owner bed status'
          }
        }
        const totalBed1 = parseInt(ownerBed.totalBed);
        const bookedCount1 = parseInt(ownerBed.bookedCount);
        const availableBed=totalBed1 - bookedCount1;
        console.log('total bed is'+totalBed1);
        console.log('booked count is '+bookedCount1);
        console.log('available bed is'+availableBed);
        const updateBedResult = await OwnerSchemaModel.findOneAndUpdate(
          {email:model.ownerEmail},
          {availableBed:parseInt(availableBed)}
          );
        if(!updateBedResult){
          console.log('error updating bed status');
          return {
            success:false,
            message:'error updating bed status'
          }
        }
        console.log('owner booked result');
        console.log(bookedResultOwner);
        console.log('guest booked result');
        console.log(bookedResultGuest);

        otpCache.del(model.ownerEmail);
        return {
          success:true,
          message:'otp verified & booked successfully'
        }
      }else{
        console.log('no sufficient bed');
        return {
          success:false,
          message:'no sufficient bed'
        }
      }
      
    }else{
      console.log('already booked');
      return {
        success:false,
        message:'already booked '
      }
    }
     


    }else{
      console.log('otp expired');
      otpCache.del(email);
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

}catch(err){
  console.log(err.message);
  return {
    success:false,
    message:'something went wrong'
  }
}


}


//---------------------------------------------------------SEND OTP FOR UNBOOK--------------------------------------
async function sendOtpForUnbook(email){
   
  try{
    
    const otp = randomstring.generate({
      length: 6,
      charset: 'numeric',
    });

    const expirationTime = Date.now() + 5 * 60 * 1000; // 10 minutes from now
    
    otpCache.set(email, { otp, expirationTime });

    const otpData2 = otpCache.get(email);

    console.log(otpData2.otp);
    console.log(otpData2.expirationTime);
    
    //-------------------sending the email-----------------
    const result = mailer.sendEmail(email, 'otp for unbook your hostle, sent by guest', `Your OTP is: ${otp}`);
    if (!result) {
      console.log('some error occured while sending otp for booking');
      return {
        success: false,
        message: 'unable to send otp',
      };
    } else {
      console.log('successfully sent Otp to owner email');
      return {
        success: true,
        message: 'successfully sent Otp to owner email'
      };

    } 

  }catch(err){
     console.log('something went wrong inside service while sending booking otp');
     console.log(err.message);
     return {
      success:false,
      message:'something went wrong while sending booking otp'
     }
  }
 
}


//---------------------------------------------------------VERIFY OTP FOR UNBOOK------------------------------------
async function verifyOtpAndUnbook(model){
  console.log(model.ownerEmail);
  console.log(model.guestEmail);
  console.log(model.userEnteredOtp);
  console.log(model.bookedHostleName);
  try{
    const otpData = otpCache.get(model.ownerEmail);
    console.log(otpData.otp);
  
    if (otpData.otp === model.userEnteredOtp) {
      const currentTime = Date.now();
  
      console.log('valid otp');
      if (currentTime <= otpData.expirationTime) {
        const book = await GuestSchemaModel.findOne({email:model.guestEmail}).select('bookedTo bookedStatus fname lname');
        console.log(book);
        if(book.bookedTo == model.ownerEmail && book.bookedStatus == true){
          const updateBookedGuest=await GuestSchemaModel.findOneAndUpdate({email:model.guestEmail},{ $unset: { bookedTo: 1, bookedHostleName: 1, joinedDate: 1}, bookedStatus: model.bookedStatus },);
          if(!updateBookedGuest){
            console.log('error updating while unbook the hostel');
            return{
              success:false,
              message:'error updating while unbook the hostel'
            }
          }
          const ownerQuery = OwnerSchemaModel.findOne({ email: model.ownerEmail }).select('bookedCount');
          const owner = await ownerQuery.exec();
          console.log(owner);
          var bookedCount = owner.bookedCount;
          console.log(bookedCount); // Output the value of bookedCount
          bookedCount=bookedCount-1;
          const bookedResultOwner = await OwnerSchemaModel.findOneAndUpdate(
            {email:model.ownerEmail},
            {
              $pull: { guestNameList:{guestEmail:model.guestEmail}},
              $set:{bookedCount: parseInt(bookedCount)}
            },
          );
          if(!bookedResultOwner){
            console.log('error updating owner while unbook the hostel');
            return {
              success:false,
              message:'error updating owner while unbook the hostel'
            }
          }
          const accountUnbookResult = await AccountSchemaModel.findOneAndUpdate(
            { ownerEmail: model.ownerEmail },
            {
              $pull: { guests: { guestEmail: model.guestEmail } }
            },
            { new: true }
          );
            if (!accountUnbookResult) {
              console.log('unable to remove guest on account database');
              return {
                success: false,
                message: 'unable to remove guest on account database.'
              };
            }
            let ownerBed = await OwnerSchemaModel.findOne({email:model.ownerEmail}).select('totalBed bookedCount');
         if(!ownerBed){
          console.log('error finding owner bed status');
          return {
            success:false,
            message:'error finding owner bed status'
          }
        }
        const totalBed1 = parseInt(ownerBed.totalBed);
        const bookedCount1 = parseInt(ownerBed.bookedCount);
        const availableBed=totalBed1 - bookedCount1;
        console.log('total bed is'+totalBed1);
        console.log('booked count is '+bookedCount1);
        console.log('available bed is'+availableBed);
        const updateBedResult = await OwnerSchemaModel.findOneAndUpdate(
          {email:model.ownerEmail},
          {availableBed:parseInt(availableBed)}
          );
        if(!updateBedResult){
          console.log('error updating bed status');
          return {
            success:false,
            message:'error updating bed status'
          }
        }
          console.log('owner booked result');
          console.log(bookedResultOwner);
          console.log('guest booked result');
          console.log(updateBookedGuest);
          otpCache.del(model.ownerEmail);
          return {
            success:true,
            message:'otp verified and hostle unbooked successfully'
          }
        }else{
          console.log('already unbooked');
          return {
            success:false,
            message:'already unbooked '
          }
        }

      }else{
        console.log('otp expired');
        otpCache.del(email);
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
  
  }catch(err){
    console.log(err);
    console.log(err.message);
    return {
      success:false,
      message:'something went wrong'
    }
  }
}

//-----------------------------------------------------------UNBOOK GUEST FOR OWNER--------------------------------
async function unbookGuestForOwner(model){
  //const session = await mongoose.startSession();
  try{
    //session.startTransaction();
    console.log('transaction started');
    const book = await GuestSchemaModel.findOne({ email: model.guestEmail },'bookedTo bookedStatus fname lname');
        console.log('guest fetched for cheking');
        if(book.bookedTo == model.ownerEmail && book.bookedStatus == true){
          console.log('existing checked');
          const updateBookedGuest=await GuestSchemaModel.findOneAndUpdate({email:model.guestEmail},{ $unset: { bookedTo: 1, bookedHostleName: 1, joinedDate: 1}, bookedStatus: model.bookedStatus });
          if(!updateBookedGuest){
            console.log('guest not updated');
            return {
              success:false,
              message:'guest not updated'
            }
          }
          const ownerQuery = OwnerSchemaModel.findOne({ email: model.ownerEmail }).select('bookedCount');
          const owner = await ownerQuery.exec();
          console.log(owner);
          var bookedCount = owner.bookedCount;
          console.log(bookedCount); // Output the value of bookedCount
          bookedCount=bookedCount-1;

          const bookedResultOwner = await OwnerSchemaModel.findOneAndUpdate(
            {email:model.ownerEmail},
            {
              $pull: { guestNameList:{guestEmail:model.guestEmail}},
              $set:{bookedCount: parseInt(bookedCount)}
            },
          );
          if(!bookedResultOwner){
            console.log('guest updated but owner not updated');
            return {
              success:false,
              message:'guest updated but owner not updated'
            }
          }
          
          const accountUnbookResult = await AccountSchemaModel.findOneAndUpdate(
            { ownerEmail: model.ownerEmail },
            {
              $pull: { guests: { guestEmail: model.guestEmail } }
            },
            { new: true }
          );
          if(!accountUnbookResult){
            console.log('guest and owner updated but account not updated');
            return {
               success:false,
               message:'guest and owner updated but account not updated'
            }
          }
          return {
            success:true,
            message:'guest removed successfully'
          }
      }else{
        console.log('already unbooked');
        return {
          success:false,
          message:'already unbooked '
        }
      }

  }catch(err){
    console.log('error occured in services while removing the guest');
    console.log(err.message);
    // // If any operation fails, rollback the transaction
    // await session.abortTransaction();
    // session.endSession();
    return {
      success:false,
      message:'Internal server error'
    }
  }

}




module.exports = {
  fetchHostle,
  bookHostle,
  unBookHostle,
  sendOtpForBook,
  verifyOtpAndBook,
  sendOtpForUnbook,
  verifyOtpAndUnbook,
  unbookGuestForOwner
};





[
{
  ownerEmail:'owner1@example.com',
  guestNameList:[
    {
      guestEmail:'guest1@example.com',
      guestName:'guest1 name'
    }
  ]
}
]