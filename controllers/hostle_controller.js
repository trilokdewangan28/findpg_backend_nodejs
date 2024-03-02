const hostleService = require('../services/hostle_services'); // Assuming the correct path to the hostleService module


//-----------------------------------------------------------FETCH HOSTLE CONTROLELRS
exports.fetchHostle = async (req, res, next) => {
  try {
    const result = await hostleService.fetchHostle();
    if(result.success==false){
      return res.status(500).send({
        success:result.success,
        message:result.message
      })
    }else{
      console.log('access granted');
      console.log(result);
      return res.status(200).send({
        code:200,
        success:result.success,
        message:result.message,
        result:result.result
      })
    }
  } catch (err) {
    console.log('invalid credentials inside the controller');
    console.log(err.message);
    return next(
      res.status(500).send({
        code:500,
        success:false,
        message:'Internal server error in controller'
      })
    );
  }
};


//---------------------------------------------------------------BOOK HOSTLE CONTROLLERS
exports.bookHostle=async(req,res,next)=>{
  try{
    var model = {
      ownerEmail: req.body.ownerEmail,
      bookedHostleName:req.body.bookedHostleName,
      guestEmail:req.body.guestEmail,
      bookedStatus:req.body.bookedStatus,
    }
     
    console.log(model);
    const result = await hostleService.bookHostle(model);
    if(result.success==false){
      return res.status(500).send({
        success:result.success,
        message:result.message
      })
    }else{
      console.log('access granted');
      return res.status(200).send({
        code:200,
        success:result.success,
        message:result.message,
        result:result.result
      })
    }


  }catch(err){
    console.log('unable to book in controller');
    console.log(err.message);
    return next(
      res.status(500).send({
        code:500,
        success:false,
        message:'Internal server error in controller'
      })
    )
  }
}

//--------------------------------------------------------------------UNBOOK HOSTLE CONTROLLERS
exports.unBookHostle=async(req,res,next)=>{
  try{
    var model = {
      ownerEmail: req.body.ownerEmail,
      bookedHostleName:req.body.bookedHostleName,
      guestEmail:req.body.guestEmail,
      bookedStatus:req.body.bookedStatus
    }

    const result = await hostleService.unBookHostle(model);
    if(result.success==false){
      return res.status(500).send({
        success:result.success,
        message:result.message
      })
    }else{
      console.log('access granted');
      return res.status(200).send({
        code:200,
        success:result.success,
        message:result.message,
        result:result.result
      })
    }


  }catch(err){
    console.log('unable to unbook in controller');
    console.log(err.message);
    return next(
      res.status(500).send({
        code:500,
        success:false,
        message:'Internal server error in controller'
      })
    )
  }
}



//-----------------------------------------------------SEND OTP FOR BOOKING--------------------------------------
exports.sendOtpForBook = async(req,res,next)=>{
  email = req.body.email;
  const result = await hostleService.sendOtpForBook(email);
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

//---------------------------------------------------------VERIFY OTP AND BOOK------------------------------------------------------------------------------
exports.verifyOtpAndBook=async(req,res,next)=>{
  try{
    var model = {
      ownerEmail: req.body.ownerEmail,
      bookedHostleName:req.body.bookedHostleName,
      guestEmail:req.body.guestEmail,
      year:req.body.year,
      month:req.body.month,
      paidStatus:req.body.paidStatus,
      bookedStatus:req.body.bookedStatus,
      userEnteredOtp:req.body.userEnteredOtp
    }
    

     
    console.log(model);
    const result = await hostleService.verifyOtpAndBook(model);
    if(result.success==false){
      return res.status(500).send({
        success:result.success,
        message:result.message
      })
    }else{
      console.log('access granted');
      return res.status(200).send({
        code:200,
        success:result.success,
        message:result.message,
        result:result.result
      })
    }


  }catch(err){
    console.log('unable to book in controller');
    console.log(err.message);
    return next(
      res.status(500).send({
        code:500,
        success:false,
        message:'Internal server error in controller'
      })
    )
  }
}


//----------------------------------------------------------------SEND OTP FOR UNBOOK------------------------------------------------------
exports.sendOtpForUnbook = async(req,res,next)=>{
  email = req.body.email;
  console.log(email);
  const result = await hostleService.sendOtpForUnbook(email);
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


//------------------------------------------------------------------VERIFY OTP AND UNBOOK--------------------------------------------------------

exports.verifyOtpAndUnbook=async(req,res,next)=>{
  try{
    var model = {
      ownerEmail: req.body.ownerEmail,
      bookedHostleName:req.body.bookedHostleName,
      guestEmail:req.body.guestEmail,
      bookedStatus:req.body.bookedStatus,
      userEnteredOtp:req.body.userEnteredOtp
    }
     
    console.log(model);
    const result = await hostleService.verifyOtpAndUnbook(model);
    if(result.success==false){
      return res.status(500).send({
        success:result.success,
        message:result.message
      })
    }else{
      console.log('access granted');
      return res.status(200).send({
        code:200,
        success:result.success,
        message:result.message,
        result:result.result
      })
    }


  }catch(err){
    console.log('unable to unbook in controller');
    console.log(err.message);
    return next(
      res.status(500).send({
        code:500,
        success:false,
        message:'Internal server error in controller'
      })
    )
  }
}

//------------------------------------------------------------------UNBOOK GUEST FOR OWNER
exports.unbookGuestForOwner=async(req,res,next)=>{
  try{
    var model = {
      ownerEmail: req.body.ownerEmail,
      bookedHostleName:req.body.bookedHostleName,
      guestEmail:req.body.guestEmail,
      bookedStatus:req.body.bookedStatus,
    }
     
    console.log(model);
    const result = await hostleService.unbookGuestForOwner(model);
    if(result.success==false){
      return res.status(500).send({
        success:result.success,
        message:result.message
      })
    }else{
      console.log('access granted');
      return res.status(200).send({
        code:200,
        success:result.success,
        message:result.message,
        result:result.result
      })
    }


  }catch(err){
    console.log('unable to unbook in controller');
    console.log(err.message);
    return next(
      res.status(500).send({
        code:500,
        success:false,
        message:'Internal server error in controller'
      })
    )
  }
}






