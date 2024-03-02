const guestService = require('../services/guest_services');
const GuestSchemaModel = require('../models/guestSchemaModel');
const fs = require('fs');



//------------------------------------------------------------------------------register the guest---------------------------------------------------------
exports.registerGuest = async(req,res,next)=>{
    console.log(req.body.email);
    console.log(req.body.password);
    var model = {
        email: req.body.email,
        password: req.body.password,
        fname:req.body.fname,
        lname: req.body.lname,
        contactNo:req.body.contactNo,
        adharNo:req.body.adharNo,
        profession:req.body.profession,
        clgName: req.body.clgName,
        city:req.body.city,
        address: req.body.address,
        mapAddressUrl:req.body.mapAddressUrl,
        pincode:req.body.pincode,
        selectedUserCategory:req.body.selectedUserCategory,
        profilePic: req.body.guestProfilePic

    };
    console.log(model);
   try {
        const result = await guestService.registerGuest(model);
        if(result.success==false){
          return res.status(500).send({success: result.success, message:result.message,});
      }else{
          return res.status(200).send({
              success:result.success,
              message: result.message,
             }); 
      }
        } catch (err) {
        console.log('something went wrong in guest controller');
        console.log(err.message);
        return next(err);
      }
}




//------------------------------------------------------------------------fetch the guest data---------------------------------------------------------------
exports.loginGuest = async(req,res,next)=>{
    console.log(req.body.email);
    console.log(req.body.password);
    var model = {
        email: req.body.email,
        password: req.body.password
    };
    console.log(model);
   try {
        const result = await guestService.loginGuest(model);

        if(result.success==false){
          return res.status(500).send({
              success:result.success,
              message:result.message 
            });
      }else{

        return res.status(200).send({
          success:result.success,
          message:result.message,
          token:result.token
        });
      }

        } catch (err) {
        console.log('something went wrong in owner controller');
        console.log(err.message);
        return next(err);
      }
}



//--------------------------------------------------------------------------update the guest data--------------------------------------------------------------
exports.updateGuest = async(req,res,next)=>{
    console.log(req.body.email);
    
    const email = req.body.email;
    
    var model = {
      
        contactNo:req.body.contactNo,
        profession:req.body.profession,
        clgName: req.body.clgName,
        city:req.body.city,
        address: req.body.address,
        pincode:req.body.pincode,
        mapAddressUrl:req.body.mapAddressUrl

    };
  
   try {
        const result = await guestService.updateGuest(email,model);

        if(result.success==false){
          return res.status(500).send({success: result.success, message:result.message});
      }else{
          return res.status(200).send({
              success:result.success,
              message:result.message
             }); 
      }

        } catch (err) {
        console.log('something went wrong in guest controller while updating');
        console.log(err.message);
        return next(err);
      }
}


//------------------------------------------------------------------------------------delete the guest---------------------------------------------------------------------
exports.deleteGuest = async(req,res,next)=>{
    console.log(req.body.email);
    console.log(req.body.password);
    var model = {
        email: req.body.email,
        password: req.body.password,
    };
    console.log(model);
   try {
        const result = await guestService.deleteGuest(model);

        if(result.success==false){
          return res.status(500).send({success: result.success, message:result.message});
      }else{
          return res.status(200).send({
              success:result.success,
              message: result.message,
             }); 
      }

        } catch (err) {
        console.log('something went wrong in guest controller while deleting');
        console.log(err.message);
        return next(err);
      }
}


//---------------------------------------send otp forgot password
exports.sendOtpForgotPasswordForGuest = async(req,res,next)=>{
  const email = req.body.email;
  console.log(email);
  const result = await guestService.sendOtpForgotPasswordForGuest(email);
  if(result.success==false){
    res.status(500).send({
      success:result.success,
      message:result.message
    })
  }
  else{
    res.status(200).send({
      success:result.success,
      message:result.message
    })
  }
}

//-----------------------------------------------------------verify otp and update password
exports.verifyOtpAndUpdatePasswordForGuest = async(req, res,next)=>{
  const model = {
    email:req.body.email,
    newPassword:req.body.newPassword
  }
  const userEnteredOtp = req.body.userEnteredOtp;
  const result = await guestService.verifyOtpAndUpdatePasswordForGuest(model, userEnteredOtp);
  if(result.success==false){
    return res.status(500).send(
      {
        success:result.success,
        message:result.message
      }
    )
  }else{
    return res.status(200).send({
      success:result.success,
      message:result.message
    })
  }
}


//---------------------------------------------------------------------fetch guest data using token-----------------------------------------
exports.guestProfile = async(req,res,next)=>{
    const email= req.user.email;
    console.log('inside the guestprofile controller'+email);
    try {
        const result = await guestService.guestProfile(email);

        if(result==false){
          return res.status(500).send({
            success:result.success,
            message:result.message
          });
      }else{
            return res.status(200).send({
               success:result.success,
               message:result.message,
               result:result.result
            });
          }

        } catch (err) {
        console.log('something went wrong in guest controller');
        console.log(err.message);
        return next(err);
      }

}



//----------------------------------------------------------guest profile pic uploads------------------------------
exports.uploadGuestProfilePic = async (req, res) => {
    try {
      const email = req.body.email;
      const profilePic = req.file.filename;
      console.log(profilePic);
      // Update the user document with the profile picture filename or URL
      const updatedUser = await GuestSchemaModel.updateOne(
        { email: email },
        { profilePic: profilePic }
      );
  
      res.status(200).send({success:true, message: 'Profile picture updated successfully', user: updatedUser });
    } catch (err) {
      console.error('Error uploading profile picture:', err);
      res.status(500).send({success:false, message: 'An error occurred during profile picture upload' });
    }
  };

//---------------------------------------------------------delete guest profile picture-------------------------------------------
  exports.deleteGuestProfilePic = async (req, res) => {
    console.log('delete guest profile picture method called');
    try {
      const { email, profilePic } = req.body;
  
      // Delete the image file from the uploads folder
      fs.unlinkSync(`guestUploads/guestProfilePic/${profilePic}`);
  
      // Update the user document to remove the profile picture
      const updatedUser = await GuestSchemaModel.updateOne(
        { email: email },
        { $unset: { profilePic: 1 } }
      );
      if(updatedUser){
        console.log('prifile picture deleted');
        res.status(200).json({ success: true, message: 'Profile picture deleted successfully', user: updatedUser });
      }else{
        console.log('something went wrong during deletion of profile picture');
        res.status(500).json({ success: true, message: 'something went wrong during deletion', user: updatedUser });
      }
      
    } catch (err) {
      console.error('Error deleting profile picture:', err);
      res.status(500).json({ success: false, message: 'An error occurred during profile picture deletion' });
    }
  };

  exports.fetchBookedGuestDetails = async(req,res,next)=>{
    const guestEmail=req.body.guestEmail;
    console.log('guest email is: '+guestEmail);
    try{
      const result= await guestService.fetchBookedGuestDetails(guestEmail);

      if(result.success==false){
        return res.status(500).send({
          success:result.success,
          message:result.message
        });
      }else{
        return res.status(200).send({
          success:result.success,
          message:result.message,
          result:result.result
        });
      }
    }catch(err){
      console.log('something went wrong while fetching bookedGuestDetail inside the controller');
      console.log(err.message);
      return  res.status(500).send({
          success:false,
          message:'internal server error'
        });
    }

  }


  
//------------------------------------------------------------SEND EMAIL VERIFICATION MAIL--------------------------------------
exports.sendVerificationMailForGuest = async(req,res,next)=>{
  email = req.body.email;
  console.log(email);
  const result = await guestService.sendVerificationMailForGuest(email);
  if(result.success==false){
    res.status(500).send({
      success:result.success,
      message:result.message
    })
  }
  else{
    res.status(200).send({
      success:result.success,
      message:result.message
    })
  }
}

//-------------------------------------------------------------VERIFICATION OF OTP----------------------------------------------
exports.verifyOtpForGuest = async(req,res,next)=>{
email = req.body.email;
userEnteredOtp = req.body.userEnteredOtp;
userOtp = parseInt(userEnteredOtp)
const result = await guestService.verifyOtpForGuest(email,userEnteredOtp);
if(result.success==false){
  res.status(500).send({
    success:result.success,
    message:result.message
  })
}
else{
  res.status(200).send({
    success:result.success,
    message:result.message
  })
}
}