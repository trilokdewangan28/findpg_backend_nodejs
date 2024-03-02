const rateService = require('../services/rate_services');

exports.rateTheOwner = async (req,res,next)=>{
    const model = {
        ownerEmail:req.body.ownerEmail,
        guestEmail:req.body.guestEmail,
        rate:req.body.rate
    };

    try{

        const result = await rateService.rateTheOwner(model);
        if(result.success==true){
            res.status(200).send({
                success:result.success,
                message:result.message
            })
        }else{
            return res.status(500).send({
                success:result.success,
                message:result.message
            })
        }

    }catch(err){
        console.log(err);
        console.log('error while rating in controller');
        return {
            success:false,
            message:'error while rating in controller'
        }
    }
}

exports.fetchTheRate = async (req,res,next)=>{

    try{

        const result = await rateService.fetchTheRate();
        if(result.success==false){
            return res.status(500).send({
                success:result.success,
                message:result.message
            })
        }else{
            return res.status(200).send({
                success:result.success,
                message:result.message,
                result:result.result
            })
        }
  }catch(err){
       return res.status(500).send({
        success:false,
        message:'internal server error inside controller'
       })
    }
}