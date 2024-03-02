const ownerService = require('../services/owner_services');
const OwnerSchemaModel = require('../models/ownerSchemaModel');
const fs = require('fs');



//------------------------------------------------------------------------------register the owner---------------------------------------------------------
exports.registerOwner = async(req,res,next)=>{
    console.log(req.body.email);
    console.log(req.body.password);
    var model = {
        email: req.body.email,
        password: req.body.password,
        hostleName:req.body.hostleName,
        totalBed:req.body.totalBed,
        contactNo:req.body.contactNo,
        city:req.body.city,
        address: req.body.address,
        mapAddressUrl:req.body.mapAddressUrl,
        pincode:req.body.pincode,
        selectedUserCategory:req.body.selectedUserCategory,
        selectedHostleCategory:req.body.selectedHostleCategory,
        //guestNameList:req.body.guestNameList

    };
    console.log(model);
   try {
        const result = await ownerService.registerOwner(model);
        if(result.success==false){
            return res.status(500).send({success: result.success, message:result.message,});
        }else{
            return res.status(200).send({
                success:result.success,
                message: result.message,
               }); 
        }
        } catch (err) {
        console.log('something went wrong in registration controller');
        console.log(err.message);
        return next(res.status(500).send({
            success:false,
            message:'something went wrong in registration controller',
            error:err.message
        }));
      }
}




//------------------------------------------------------------------------fetch the owner data---------------------------------------------------------------
exports.loginOwner = async(req,res,next)=>{
    console.log(req.body.email);
    console.log(req.body.password);
    var model = {
        email: req.body.email,
        password: req.body.password
    };
    console.log(model);
   try {
        const result = await ownerService.loginOwner(model);

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
        console.log('something went wrong in login controller');
        console.log(err.message);
        return next(
          res.status(500).send({
            success:false,
            message:'something went wrong in login controller',
            error:err.message
          })
        );
      }
}



//--------------------------------------------------------------------------update the user data--------------------------------------------------------------
exports.updateOwner = async(req,res,next)=>{
    console.log(req.body.email);
    const email = req.body.email;
    var model = {
        hostleName:req.body.hostleName,
        totalBed:req.body.totalBed,
        contactNo:req.body.contactNo,
        selectedHostleCategory:req.body.selectedHostleCategory,

    };
   try {
        const result = await ownerService.updateOwner(email,model);

        if(result.success==false){
            return res.status(500).send({success: result.success, message:result.message});
        }else{
            return res.status(200).send({
                success:result.success,
                message:result.message
               }); 
        }

        } catch (err) {
        console.log('something went wrong in owner controller while updating');
        console.log(err.message);
        return next(
          res.status(500).send({
            success:false,
            message:'something went wrong in owner controller while updating'
          })
        );
      }
}


//------------------------------------------------------------------------------------delete the owner---------------------------------------------------------------------
exports.deleteOwner = async(req,res,next)=>{
    console.log(req.body.email);
    console.log(req.body.password);
    var model = {
        email: req.body.email,
        password: req.body.password,
    };
   try {
        const result = await ownerService.deleteOwner(model);

        if(result.success==false){
            return res.status(500).send({success: result.success, message:result.message});
        }else{
            return res.status(200).send({
                success:result.success,
                message: result.message,
               }); 
        }

        } catch (err) {
        console.log('something went wrong in owner controller while deleting');
        console.log(err.message);
        return next(
          res.status(500).send({
          success:false,
          message:'something went wrong in owner controller while deleting'
        })
        );
      }
}


//---------------------------------------------------------------forgot password send otp---------------
exports.sendOtpForgotPasswordForOwner = async(req,res,next)=>{
  const email = req.body.email;
  console.log(email);
  const result = await ownerService.sendOtpForgotPasswordForOwner(email);
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
exports.verifyOtpAndUpdatePasswordForOwner = async(req, res,next)=>{
  const model = {
    email:req.body.email,
    newPassword:req.body.newPassword
  }
  const userEnteredOtp = req.body.userEnteredOtp;
  const result = await ownerService.verifyOtpAndUpdatePasswordForOwner(model, userEnteredOtp);
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



//-----------------------------------------------------fetch owner profile using token---------------------------
exports.ownerProfile = async(req,res,next)=>{
    const email= req.user.email;
    console.log('inside the ownerprofile controller'+email);
    try {
        const result = await ownerService.ownerProfile(email);

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
            
        } catch (err) {
        console.log('something went wrong in ownerProfile controller');
        console.log(err.message);
        return next(
          res.status(500).send({
            success:false,
            message:'something went wrong in ownerProfile controller'
          })
        );
      }

}


//----------------------------------------------------------owner profile pic uploads------------------------------
exports.uploadOwnerProfilePic = async (req, res) => {
    try {
      const email = req.body.email;
      const profilePic = req.file.filename;
      console.log(profilePic);
      // Update the user document with the profile picture filename or URL
      const updatedUser = await OwnerSchemaModel.updateOne(
        { email: email },
        { profilePic: profilePic }
      );
  
      res.status(200).json({ message: 'Profile picture uploaded successfully', user: updatedUser });
    } catch (err) {
      console.error('Error uploading profile picture:', err);
      res.status(500).json({ message: 'An error occurred during profile picture upload' });
    }
  };

//---------------------------------------------------------delete owner profile picture-------------------------------------------
  exports.deleteOwnerProfilePic = async (req, res) => {
    try {
      const { email, profilePic } = req.body;
  
      // Delete the image file from the uploads folder
      fs.unlinkSync(`ownerUploads/ownerProfilePic/${profilePic}`);
  
      // Update the user document to remove the profile picture
      const updatedUser = await OwnerSchemaModel.updateOne(
        { email: email },
        { $unset: { profilePic: 1 } }
      );
  
      res.status(200).json({ success: true, message: 'Profile picture deleted successfully', user: updatedUser });
    } catch (err) {
      console.error('Error deleting profile picture:', err);
      res.status(500).json({ success: false, message: 'An error occurred during profile picture deletion' });
    }
  };



 //--------------------------------------------------------owner hostle pic upload--------------------------------------- 
exports.uploadOwnerHostlePic = async (req, res) => {
  try {
    const email = req.body.email;
    const ownerHostlePic = req.file.filename;
    console.log(ownerHostlePic);
    // Update the user document with the hostle picture filename or URL
    const updatedUser = await OwnerSchemaModel.findOneAndUpdate(
      { email: email },
      { $push: { ownerHostlePic: ownerHostlePic } },
      { new: true }
    );

    res.status(200).json({success:true, message: 'Hostle image uploaded successfully', user: updatedUser });
  } catch (err) {
    console.error('Error uploading hostle images:', err);
    res.status(500).json({success:false, message: 'An error occurred during hostle images upload' });
  }
};

//---------------------------------------------------------delete hostle images -----------------------------------
exports.deleteOwnerHostlePic = async (req, res) => {
  try {
    const { email, ownerHostlePic } = req.body;

    // Delete the image file from the folder
    console.log(email,ownerHostlePic);
    fs.unlinkSync(`ownerUploads/hostlePic/${ownerHostlePic}`);

    // Update the user document to remove the image URL
    const updatedUser = await OwnerSchemaModel.findOneAndUpdate(
      { email: email },
      { $pull: { ownerHostlePic: ownerHostlePic } },
      { new: true }
    );

    res.status(200).json({success:true, message: 'Hostle image deleted successfully'});
  } catch (err) {
    console.error('Error deleting hostle image:', err);
    res.status(500).json({success:false, message: 'An error occurred during hostle image deletion' });
  }
};


//------------------------------------------------------------SEND EMAIL VERIFICATION MAIL--------------------------------------
exports.sendVerificationMailForOwner = async(req,res,next)=>{
    email = req.body.email;
    console.log(email);
    const result = await ownerService.sendVerificationMailForOwner(email);
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
exports.verifyOtpForOwner = async(req,res,next)=>{
  email = req.body.email;
  userEnteredOtp = req.body.userEnteredOtp;
  userOtp = parseInt(userEnteredOtp)
  const result = await ownerService.verifyOtpForOwner(email,userEnteredOtp);
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

//---------------------------------------------------------------RATE THE OWNER------------------------------------------------
exports.rateTheOwner = async(req,res,next)=>{
  const model = {
    ownerEmail:req.body.ownerEmail,
    guestEmail:req.body.guestEmail,
    guestName:req.body.guestName,
    feedback:req.body.feedback,
    rate:req.body.rate
  };
  console.log(req.body.rate);

  try{

    const result = await ownerService.rateTheOwner(model);
    if(result.success==false){
      return res.status(500).send({
        success:result.success,
        message:result.message
      })
    }else{
      return res.status(200).send({
        success:result.success,
        message:result.message
      })
    }

  }catch(err){
    console.log('something went wrong by rating in controller');
    console.log(err.message);
    return res.status(500).send({
      success:false,
      message:'somethng went wrong by rating in controller'
    })
  }
}

//--------------------------------------------------------------UPDATE THE RATINGS----------------------
exports.updateRating = async(req,res,next)=>{
  const model = {
    ownerEmail:req.body.ownerEmail,
    guestEmail:req.body.guestEmail,
    feedback:req.body.feedback,
    rateToUpdate:req.body.rateToUpdate
  };

  try{

    const result = await ownerService.updateRating(model);
    if(result.success==false){
      return res.status(500).send({
        success:result.success,
        message:result.message
      })
    }else{
      return res.status(200).send({
        success:result.success,
        message:result.message
      })
    }

  }catch(err){
    console.log('something went wrong by rating in controller');
    console.log(err.message);
    return res.status(500).send({
      success:false,
      message:'somethng went wrong by rating in controller'
    })
  }
}




//--------------------------------------------------------------fetch for testing process----------------------------------------
exports.fetchTheOwnerDetails = async(req,res,next)=>{

  try{
    const ownerEmail = req.body.ownerEmail;
    const owner = await OwnerSchemaModel.findOne({email:ownerEmail});
    console.log(owner);
    return res.status(200).send({owner:owner});
  }catch(err){
    console.log(err.message);
  }
  
}