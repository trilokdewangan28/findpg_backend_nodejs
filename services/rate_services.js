const RateSchemaModel = require('../models/rateSchemaModel');

//---------------------------------------------------------RATE TO THE OWNER--------------------------------------------
async function rateTheOwner(model){
    const ownerEmail = model.ownerEmail;
    const guestEmail = model.guestEmail;
    const rate = model.rate;
    
    const rateDataModel = {
        ownerEmail:ownerEmail,
        guest:[
            {
                guestEmail:guestEmail,
                rate:rate
            }
        ]
    };

    const newGuest = {
        guestEmail:guestEmail,
        rate:rate
    }
    try{
    
    const findResult = await RateSchemaModel.find();
    console.log(findResult.length);
    
    if(findResult.length == 0){
      const newRating = await RateSchemaModel(rateDataModel);
      const result = await newRating.save();
      if(result){
        console.log('rated successfully');
        const averageRate = await calculateAverageRate(ownerEmail);
        await RateSchemaModel.findOneAndUpdate({ownerEmail:ownerEmail},{$set:{totalAverageRate:averageRate}});
        return {
            success:true,
            message:'rated successfully'
        }
      }
      else{
        console.log('failed to rating');
        return {
            success:false,
            message:'failed to rate'
        }
      }
   }
   else{
    const ownerExists = hasOwnerEmail(findResult,ownerEmail); 
    console.log(ownerExists);
    if(ownerExists){
        const owner = await RateSchemaModel.findOne({ownerEmail:ownerEmail});
        console.log(owner);

        owner.guest.push(newGuest);
        const result = await owner.save();
        if(result){
            console.log('guest length is: '+owner.guest.length);
            console.log('owner existed new guest added');
            const averageRate = await calculateAverageRate(ownerEmail);
            await RateSchemaModel.findOneAndUpdate({ownerEmail:ownerEmail},{$set:{totalAverageRate:averageRate}});
            return {
                success:true,
                message:'guest rated for existed owner'
            }
        }

    }
    else{
      const newRating = await RateSchemaModel(rateDataModel);
      const result = await newRating.save();
      if(result){
        console.log('rated successfully');
        const averageRate = await calculateAverageRate(ownerEmail);
        await RateSchemaModel.findOneAndUpdate({ownerEmail:ownerEmail},{$set:{totalAverageRate:averageRate}});
        return {
            success:true,
            message:'rated successfully'
        }
      }
      else{
        console.log('failed to rating');
        return {
            success:false,
            message:'failed to rate'
        }
      }
    }

    }
}catch(err){
        console.log(err);
        return {
            success:false,
            message:'failed to rate inside the service'
        }
    }
    
}


//---------------------------------------------------------------FETCH THE RATE-----------------------------------------
async function fetchTheRate(){
    try{
        const result = await RateSchemaModel.find();
        if(result){
            console.log(result);
            return {
                success:true,
                message:'rate fetched successfully',
                result:result
            }
        }else{
            console.log('failed to fetch rate');
            return {
                success:false,
                message:'failed to fetch rate'
            }
        }
    }catch(err){
        console.log('something went wrong in service');
        console.log(err.message);
        return {
            success:false,
            message:'internal server error'
        }
    }
}



// -------------------------------------------REUSABLE FUNCTION-------------------------------------------
function hasOwnerEmail(findResult, ownerEmailValue) {
    return findResult.some(item => item.ownerEmail === ownerEmailValue);
  }

async function calculateAverageRate(ownerEmail) {
    console.log('calculate average calll');
    const owner = await RateSchemaModel.findOne({ ownerEmail:ownerEmail });
    console.log(owner);
    let sumOfRates = 0;
    let lengthOfGuest = owner.guest.length; 

    for (const guest of owner.guest) {
     sumOfRates += guest.rate;
    }
    console.log(sumOfRates);

    let averageRate = sumOfRates/lengthOfGuest;
    console.log(averageRate);
    return averageRate;
}

module.exports = {
    rateTheOwner,
    fetchTheRate
}

