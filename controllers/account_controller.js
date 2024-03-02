const accountService = require('../services/account_services');

exports.markedAsPaid = async (req, res, next) => {
    var model = {
        ownerEmail:req.body.ownerEmail,
        guestEmail:req.body.guestEmail,
        year:req.body.year,
        month:req.body.month,
        paidStatus:req.body.paidStatus,
        userEnteredOtp:req.body.userEnteredOtp
    }
    console.log(model);
    try {
      const result = await accountService.markedAsPaid(model);
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

exports.fetchPaymentRecord = async(req,res,next)=>{
  console.log('fetchpayment record called');
  const model = {
    ownerEmail:req.body.ownerEmail,
    guestEmail:req.body.guestEmail
  };
  try{
    const result = await accountService.fetchPaymentRecord(model);
  if(result.success==false){
     return res.status(500).send({
      success:result.success,
      message:result.message,
      result:result.result
     })
  }else{
    return res.status(500).send({
      success:result.success,
      message:result.message,
      result:result.result
    })
  }
  }catch(err){
    console.log('some error occured in controller')
    console.log(err.message);
    return res.status(500).send({
      success:false,
      message:'internal server error',
      result:null
  });
  }
}

exports.sendOtp = async(req,res,next)=>{
   
  const email = req.body.email;
  console.log(email);
  try{
    const result = await accountService.sendOtp(email);
    if(result.success==false){
       return res.status(500).send({
         success:result.success,
         message:result.message
       });
    }else{
     return res.status(200).send({
       success:result.success,
       message:result.message
     })
    }
  }catch(e){
    console.log(e.message);
    console.log('unable to send email in controller')
    return res.status(500).send({
      success:false,
      message:'internal server error'
    })
  }
   

}

exports.removeGuest = async(req,res,next)=>{
  model = {
    ownerEmail:req.body.ownerEmail,
    guestEmail:req.body.guestEmail,
  }
  console.log(model);

  try{
    const result = await accountService.removeGuest(model);
    if(result.success==false){
       return res.status(500).send({
         success:result.success,
         message:result.message
       });
    }else{
     return res.status(200).send({
       success:result.success,
       message:result.message
     })
    }
  }catch(e){
    console.log(e.message);
    console.log('unable to remove guest from account');
    return res.status(500).send({
      success:false,
      message:'internal server error'
    })
  }
}