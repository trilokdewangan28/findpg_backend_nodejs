const GuestSchemaModel = require('../models/guestSchemaModel');
const validatorFunction = require('./owner_validator');
const auth = require('../middleware/auth');
const mailer = require('../middleware/mailer');
const randomstring = require('randomstring');
const NodeCache = require('node-cache');
const otpCache = new NodeCache();


//-------------------------------------------------------------OWNER REGISTRATION--------------------------------------------------
async function registerGuest(model) {
  try {
    let isGuestExist = await validatorFunction.checkUserExist(model.email, GuestSchemaModel);
    if(!isGuestExist){
      const guest = new GuestSchemaModel(model);
      const result = await guest.save(model);
      
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
async function loginGuest(model) {
  try {
    let isGuestExist = await validatorFunction.checkUserExist(model.email, GuestSchemaModel);
    if(isGuestExist){
      console.log('guest existed');
      const existedGuestPassword = await GuestSchemaModel.findOne({email: model.email}).select('password');
      console.log(existedGuestPassword.password);
      console.log(model.password);
      let isPasswordCorrect = model.password == existedGuestPassword.password;
      if(isPasswordCorrect){
         const token = auth.generateAccessToken(model.email);
         console.log('username and password are correct and token generated');
         console.log(token);
         return {success:true, message:'user email and password are correct', token:token};
      }else{
        return {success:false, message:'invalid password'};
      }
    }else{
      return {success: false, message:'invalid user email'};
    }
    // }
    // let isCredCorrect = await validatorFunction.checkOwnerLoginCred(model, OwnerSchemaModel);
    // if(isCredCorrect){
    //   const result = await OwnerSchemaModel.find(model);
    //   if(result != null){
    //      const token = auth.generateAccessToken(model.email);
    //      console.log('inside the service'+result);
    //      return token;
    //   }
    //   // console.log('inside the service'+result);
    //   // return {result, token};
    // }else{
    //   console.log('invalid email and password');
    //   return false;
    // }
    
  } catch (err) {
      console.log('something went wrong in login services');
      console.log(err);
    return {success:false, message:'something went wrong in login services'};
  }
}




//----------------------------------------------------------------UPDATING OWNER DETAILS-------------------------------------------------------  

async function updateGuest(email,model) {
  try {
    let isGuestExist = await validatorFunction.checkUserExist(email, GuestSchemaModel);
    if(isGuestExist){
      console.log('guest existed in update service');
        const result = await GuestSchemaModel.updateOne({email:email},model);
        console.log('inside the service guest updated successfully'+result);
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
async function deleteGuest(model) {
try {
  let isGuestExist = await validatorFunction.checkUserExist(model.email, GuestSchemaModel);
  if(isGuestExist){
    console.log('guest existed in update service');
    const existedGuestPassword = await GuestSchemaModel.findOne({email: model.email}).select('password');
    console.log(existedGuestPassword.password);
    console.log(model.password);
    let isPasswordCorrect = model.password == existedGuestPassword.password;
    if(isPasswordCorrect){
      console.log('password correct');
      const result = await GuestSchemaModel.deleteOne(model);
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
async function sendOtpForgotPasswordForGuest(email){
  try{
    
    const otp = randomstring.generate({
      length: 6,
      charset: 'numeric',
    });

    const expirationTime = Date.now() + 10 * 60 * 1000; // 10 minutes from now
    
    //-------------------sending the email-----------------
    const guest = await GuestSchemaModel.findOne({email:email});
    //console.log(owner);
    if(guest){
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
async function verifyOtpAndUpdatePasswordForGuest(model,userEnteredOtp){
  try{
    const otpData = otpCache.get(model.email);
    console.log(otpData.otp);
  
    if (otpData.otp === userEnteredOtp) {
      const currentTime = Date.now();
  
      console.log('valid otp');
      if (currentTime <= otpData.expirationTime) {
        await GuestSchemaModel.findOneAndUpdate({email:model.email},{password:model.newPassword});
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
async function guestProfile(email) {
try {
  let isGuestExist = await validatorFunction.checkUserExist(email, GuestSchemaModel);
  if(isGuestExist){
    const result = await GuestSchemaModel.findOne({email}).select('-_id -__v');
    if(result != null){
       console.log('inside the service guest profile');
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

//-----------------------------------------------------------------FETCH BOOKED GUEST DETAILS-------------------------------
async function fetchBookedGuestDetails(email){
  try {
    let isGuestExist = await validatorFunction.checkUserExist(email, GuestSchemaModel);
    if(isGuestExist){
      const result = await GuestSchemaModel.findOne({email:email}).select('email fname lname contactNo adharNo profession clgName city address pincode joinedDate ');
      if(result){
         console.log('inside the service guest profile');
         console.log(result);
         return {success:true, message:'valid email', result:result};
      }else{
        return {success:false, message:'unable to find result using email'};
      }
      // console.log('inside the service'+result);
      // return {result, token};
    }else{
      console.log('invalid email');
      return {success:false, message:'invalid email'};
    }
    
  } catch (err) {
      console.log('something went wrong inside service');
      console.log(err.message);
    return {
      success:false,
      message:'Internal server error'
    }
  }
  
}


//---------------------------------------------------------------SEND EMAIL VERRIFICATION MAIL FOR GUEST------------------------------------
otpData={};
async function sendVerificationMailForGuest(email){
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
    const owner = await GuestSchemaModel.findOne({email:email}).select('verifiedEmail');
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

//--------------------------------------------------------------VERIFY THE OTP FOR GUEST-----------------------------------------------
async function verifyOtpForGuest(email,userEnteredOtp){
  try{
  const otpData = otpCache.get(email);
  console.log(otpData.otp);

  if (otpData.otp === userEnteredOtp) {
    const currentTime = Date.now();

    console.log('valid otp');
    if (currentTime <= otpData.expirationTime) {
      await GuestSchemaModel.findOneAndUpdate({email:email},{verifiedEmail:true});
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


module.exports = {
    registerGuest,
    loginGuest,
    updateGuest,
    deleteGuest,
    guestProfile,
    sendOtpForgotPasswordForGuest,
    verifyOtpAndUpdatePasswordForGuest,
    fetchBookedGuestDetails,
    sendVerificationMailForGuest,
    verifyOtpForGuest
}



