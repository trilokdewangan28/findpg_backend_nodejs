function errorHandler(err,res,next){
    if(typeof err === 'string' ){
        return res.status(400).json({message:err});
    }

    if(err.name === 'validationError' ){
        return res.status(400).json({message:err.message});
    }

    return res.status(500).json({message: err.message});
}

module.exports = {errorHandler};