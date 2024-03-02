const OwnerSchemaModel = require('../models/ownerSchemaModel');
const validatorFunction = require('./owner_validator');
const auth = require('../middleware/auth');
const mailer = require('../middleware/mailer');
const randomstring = require('randomstring');
const NodeCache = require('node-cache');
const AccountSchemaModel = require('../models/accountSchemaModel');
const otpCache = new NodeCache();


//-------------------------------------------------------------OWNER REGISTRATION--------------------------------------------------
async function registerOwner(model) {
    try {
      let isOwnerExist = await validatorFunction.checkUserExist(model.email, OwnerSchemaModel);
      if(!isOwnerExist){
        console.log('owner not exists');
        const owner = new OwnerSchemaModel(model);
        const result = await owner.save(model);
        if(!result){
          console.log('registration failed');
          return {
            success:false,
            message:'registration failed'
          }
        }
        let ownerBed = await OwnerSchemaModel.findOne({email:model.email}).select('totalBed bookedCount');
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
          {email:model.email},
          {availableBed:parseInt(availableBed)}
          );
        if(!updateBedResult){
          console.log('error updating bed status');
          return {
            success:false,
            message:'error updating bed status'
          }
        }
        const ownerAccount = await AccountSchemaModel({ownerEmail:model.email});
        const ownerAccountResult = await ownerAccount.save();
        if(!ownerAccountResult){
          console.log('accouint not created for owner');
          return {
            success:false,
            message:"account not created for owner"
          }
        }
        
        if(result){
          console.log('user registered successfully');
          console.log(result); 
          return {success: true, message:'user registered successfully'}; 
        }else{
        return {success:false, message:'error while registering user'};
      }
          
      }else{
        console.log('user already exists');
        return {success:false, message:'user already exists'};
      }
      
    } catch (err) {
        console.log('something went wrong inside service');
        console.log(err);
      return {success:false, message:'something went wrong inside registration service'};
    }
  }




//--------------------------------------------------------------FETCHING OWNER DETAILS-------------------------------------------------
async function loginOwner(model) {
    try {
      let isOwnerExist = await validatorFunction.checkUserExist(model.email, OwnerSchemaModel);
      if(isOwnerExist){
        console.log('owner existed');
        const existedOwnerPassword = await OwnerSchemaModel.findOne({email: model.email}).select('password');
        console.log(existedOwnerPassword.password);
        console.log(model.password);
        let isPasswordCorrect = model.password == existedOwnerPassword.password;
        if(isPasswordCorrect){
           const token = auth.generateAccessToken(model.email);
           console.log('username and password are correct and token generated');
           console.log(token);
           return {success:true, message:'user authenticated', token:token};
        }else{
          return {success:false, message:'invalid password'};
        }
      }else{
        return {success: false, message:'invalid user email'};
      }
        
    } catch (err) {
        console.log('something went wrong in login services');
        console.log(err);
      return {success:false, message:'something went wrong in login services'};
    }
  }




//----------------------------------------------------------------UPDATING OWNER DETAILS-------------------------------------------------------  

async function updateOwner(email,model) {
    try {
      let isOwnerExist = await validatorFunction.checkUserExist(email, OwnerSchemaModel);
      if(isOwnerExist){
        console.log('owner existed in update service');
          const result = await OwnerSchemaModel.updateOne({email:email},model);
          if(!result){
            console.log('owner updation failed');
            return{
              success:false,
              message:'user detail updation failed'
            }
          }
          let ownerBed = await OwnerSchemaModel.findOne({email:email}).select('totalBed bookedCount');
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
          {email:email},
          {availableBed:parseInt(availableBed)}
          );
        if(!updateBedResult){
          console.log('error updating bed status');
          return {
            success:false,
            message:'error updating bed status'
          }
        }
          console.log('inside the service owner updated successfully');
          return {success:true, message:'user updated successfully'};     
      }else{
        console.log('user not exist');
        return {success:false, message:'invalid email for update'};
      }
      
    } catch (err) {
        console.log('something went wrong inside service while updating');
        console.log(err);
      return {success:false, message:'something went wrong in update service'};
    }
  }


//------------------------------------------------------------------DELETE OWNER DETAILS----------------------------------------------------------
async function deleteOwner(model) {
  try {
    let isOwnerExist = await validatorFunction.checkUserExist(model.email, OwnerSchemaModel);
    if(isOwnerExist){
      console.log('owner existed in update service');
      const existedOwnerPassword = await OwnerSchemaModel.findOne({email: model.email}).select('password');
      console.log(existedOwnerPassword.password);
      console.log(model.password);
      let isPasswordCorrect = model.password == existedOwnerPassword.password;
      if(isPasswordCorrect){
        console.log('password correct');
        const result = await OwnerSchemaModel.deleteOne(model);
        if(result){
          console.log('inside the service user deleted');
          return {success:true, message:'user deleted'}; 
        }else{
          return {success:false, message:'something wrong while deleting'}
        }
        
      }else{
        return {success:false, message:'invalid password for deleting'};
      }
    }else{
      console.log('invalid email for deleting');
      return {success:false, message:'invalid email for deleting'};
    }
    
  } catch (err) {
      console.log('something went wrong inside service while deleting');
      console.log(err);
    return {success:false, message:'something went wrong inside service while deleting'};
  }
}

//----------------------------------------------------------------send otp FORGOT PASSWORD-----------------------
async function sendOtpForgotPasswordForOwner(email){
  try{
    
    const otp = randomstring.generate({
      length: 6,
      charset: 'numeric',
    });

    const expirationTime = Date.now() + 10 * 60 * 1000; // 10 minutes from now
    
    //-------------------sending the email-----------------
    const owner = await OwnerSchemaModel.findOne({email:email});
    //console.log(owner);
    if(owner){
    const result = mailer.sendEmail(email, 'forgot password by OTP', `Your OTP is: ${otp}`);
    if (!result) {
      console.log('some error occured while sending verification email');
      return {
        success: false,
        message: 'unable to send mail',
      };
    } else {
      otpCache.set(email, { otp, expirationTime });

    const otpData = otpCache.get(email);

    console.log(otpData.otp);
    console.log(otpData.expirationTime);
      console.log('successfully sent Otp to your email');
      return {
        success: true,
        message: 'successfully sent Otp to your email'
      };

    } 
  }else{
    console.log('user not found');
    return {
      success:false,
      message:'user not found'
    }
  }

  }catch(err){
     console.log('something went wrong inside service while sending verification email');
     console.log(err.message);
     return {
      success:false,
      message:'something went wrong while sending email or user not found'
     }
  }
}

//-----------------------------------------------------------------verify otp and update password
async function verifyOtpAndUpdatePasswordForOwner(model,userEnteredOtp){
  try{
    const otpData = otpCache.get(model.email);
    console.log(otpData.otp);
  
    if (otpData.otp === userEnteredOtp) {
      const currentTime = Date.now();
  
      console.log('valid otp');
      if (currentTime <= otpData.expirationTime) {
        await OwnerSchemaModel.findOneAndUpdate({email:model.email},{password:model.newPassword});
        console.log('password updated successfully');
        otpCache.del(model.email);
        return {
          success:true,
          message:'password updated successfully'
        }
      }else{
        console.log('otp expired');
        otpCache.del(model.email);
        return {
          success:false,
          message:'otp expired! please try again'
        }
      }
  
    }else{
      console.log('invalid otp');
      otpCache.del(model.email);
      return {
        success:false,
        message:'invalid otp! please enter correct otp'
      }
    } 
  
  }catch(err){
    console.log(err.message);
    otpCache.del(model.email);
    return {
      success:false,
      message:'something went wrong'
    }
  }
}

//----------------------------------------------------------------OWNER PROFILE-------------------------------------------------------
async function ownerProfile(email) {
  try {
    let isOwnerExist = await validatorFunction.checkUserExist(email, OwnerSchemaModel);
    if(isOwnerExist){
      const result = await OwnerSchemaModel.findOne({email}).select('-_id -__v');
      if(result != null){
         console.log('inside the service owner profile');
         console.log(result);
         return {success:true, message:'valid email from token', result:result};
      }else{
        return {success:false, message:'unable to find result using email from token'};
      }
      // console.log('inside the service'+result);
      // return {result, token};
    }else{
      console.log('invalid email from token');
      return {success:false, message:'invalid email from token'};
    }
    
  } catch (err) {
      console.log('something went wrong inside service');
      console.log(err.message);
    return false;
  }
}

//---------------------------------------------------------------SEND EMAIL VERRIFICATION MAIL------------------------------------
otpData={};
async function sendVerificationMailForOwner(email){
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
    const owner = await OwnerSchemaModel.findOne({email:email}).select('verifiedEmail');
    console.log(owner);
    if(owner.verifiedEmail==false){
    const result = mailer.sendEmail(email, 'User Verification by OTP', `Your OTP is: ${otp}`);
    if (!result) {
      console.log('some error occured while sending verification email');
      return {
        success: false,
        message: 'unable to send mail',
      };
    } else {
      console.log('successfully sent verification Otp to your email');
      return {
        success: true,
        message: 'successfully sent verification Otp to your email'
      };

    } 
  }else{
    console.log('user already verified');
    return {
      success:false,
      message:'user already verified'
    }
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

//--------------------------------------------------------------VERIFY THE OTP-----------------------------------------------
async function verifyOtpForOwner(email,userEnteredOtp){
  try{
  const otpData = otpCache.get(email);
  console.log(otpData.otp);

  if (otpData.otp === userEnteredOtp) {
    const currentTime = Date.now();

    console.log('valid otp');
    if (currentTime <= otpData.expirationTime) {
      await OwnerSchemaModel.findOneAndUpdate({email:email},{verifiedEmail:true});
      console.log('verification successful');
      otpCache.del(email);
      return {
        success:true,
        message:'verification successful'
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

//--------------------------------------------------------------RATE THE OWNER------------------------------------------------
async function rateTheOwner(model){
  const ownerEmail = model.ownerEmail;
  const guestEmail = model.guestEmail;
  const guestName = model.guestName;
  const feedback = model.feedback;
  const rate = model.rate;

  const newGuest = {
    guestEmail:guestEmail,
    guestName:guestName,
    rated:true,
    feedback:feedback,
    rate:rate
  };
  try{

    const owner = await OwnerSchemaModel.findOne({email:ownerEmail});
    console.log(owner);
    if(owner){
      console.log('owner checked');
      const guest = await OwnerSchemaModel.findOne({email:ownerEmail, 'rateByGuest.guestEmail':guestEmail});
      if(guest){
        console.log('guest checked');
        const result = await OwnerSchemaModel.findOneAndUpdate(
          {email:ownerEmail, 'rateByGuest.guestEmail':guestEmail},
          { $set: {'rateByGuest.$.guestName':guestName ,'rateByGuest.$.rate': rate, 'rateByGuest.$.feedback':feedback } }, // Update operation
        { new: true });
        if(result){
          console.log('rate, feedback updated');
          const averageRating = await calculateAverageRate(ownerEmail);
          const averageResult = await OwnerSchemaModel.findOneAndUpdate({email:ownerEmail},{$set:{averageRating:averageRating}}); 
          if(averageResult){
            console.log('rate updated successfully');
            //console.log(result); 
            return {
            success:true,
            message:'your rating updated successfully',
            result:result};
          }else{
            console.log('can not update average rating ');
            return {
              success:false,
              message:'can not update average rating'
            }
          }
        }else{
          console.log('cannot updated feedback and rates');
          return {
            success:false,
            message:'cannot updated feedback and rates'
          }

        }

    }else{
      const result = await OwnerSchemaModel.findOneAndUpdate({email:ownerEmail},{$push:{rateByGuest:newGuest}});
      if(result){
        const averageRating = await calculateAverageRate(ownerEmail);
        await OwnerSchemaModel.findOneAndUpdate({email:ownerEmail},{$set:{averageRating:averageRating}}); 
        console.log('rated successfully');
        return {
          success:true,
          message:'rated successfully'
        }
      }else{
        console.log('something went wrong, while rating by new guest');
        return {
          success:false,
          message:'something went wrong, while rating by new guest'
        }
      }
     
    }
  }else{
    console.log('owner not found');
    return {
      success:false,
      message:'owner not found'
    }
  }
 

  }catch(err){
    console.log(err.message);
    return {
      success:false,
      message:'something went wrong while rating in service'
    }
  }


}

//-------------------------------------------------------reusable function
async function calculateAverageRate(ownerEmail) {
  console.log('calculate average calll');
  const owner = await OwnerSchemaModel.findOne({email:ownerEmail });
  console.log(owner);
  let sumOfRates = 0;
  let lengthOfGuest = owner.rateByGuest.length; 

  for (const rateByGuest of owner.rateByGuest) {
   sumOfRates += rateByGuest.rate;
  }
  console.log(sumOfRates);
  

  let averageRate = sumOfRates/lengthOfGuest;
  averageRate = Number(averageRate.toFixed(2));
  console.log(averageRate);
  return averageRate;
}

//--------------------------------------------------------------UPDATE THE RATING-------------------------
async function updateRating(model){
  const ownerEmail = model.ownerEmail;
  const guestEmail = model.guestEmail;
  const feedbackToUpdate=model.feedback;
  const rateToUpdate = model.rateToUpdate;

  try{
    const owner = await OwnerSchemaModel.findOne({email:ownerEmail});
    if(owner){
      const result = await OwnerSchemaModel.findOneAndUpdate(
        {email:ownerEmail, 'rateByGuest.guestEmail':guestEmail},
        { $set: { 'rateByGuest.$.rate': rateToUpdate, 'rateByGuest.$.feedback':feedbackToUpdate } }, // Update operation
      { new: true });
      console.log('owner and guest finded');
      console.log(result); 
      return {
        success:true,
        message:'owner and guest founded',
        result:result
      }
    }else{
      console.log('owner not found');
      return {
        success:false,
        message:'owner not found'
      }
    }
  }catch(err){
    console.log(err.message);
    return {
      success:false,
      message:'something went wrong updating rating'
    }
  }
}



module.exports = {
    registerOwner,
    loginOwner,
    updateOwner,
    deleteOwner,
    sendOtpForgotPasswordForOwner,
    verifyOtpAndUpdatePasswordForOwner,
    ownerProfile,
    sendVerificationMailForOwner,
    verifyOtpForOwner,
    rateTheOwner,
    updateRating
}

