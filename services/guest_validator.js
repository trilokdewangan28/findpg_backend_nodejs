// ---------------------------------------CHECK OWNER EXISTENCE-----------------------------------
async function checkGuestExist(email, GuestSchemaModel){
    console.log('inside the function from validator function file ................'+email);
     try{
        //let Owner = new  OwnerSchemaModel(req.body);
        const isGuestExist = await GuestSchemaModel.findOne({email: email});
        if(isGuestExist) return true;
       
        return false;
    
    }catch(e){
        console.log('error inside checkOwnerExist ', e.message)
        return true;
    }
}




//---------------------------------------------CHECK OWNER LOGIN CREDENTIALS----------------------------------------
async function checkGuestLoginCred(model, GuestSchemaModel){
    console.log('inside the function from validator function file ................'+model.email, model.password);
     try{
        //let Owner = new  OwnerSchemaModel(req.body);
        const isCredCorrect = await GuestSchemaModel.findOne({email: model.email, password: model.password});
        if(isCredCorrect) return true;
       
        return false;
    
    }catch(e){
        console.log('error inside checkGuestLoginCred ', e.message)
        return true;
    }
}

//-----------------------------------------------------------------------------check owner existes for update------------------------------------------------------------
async function checkGuestExistForUpdate(email, GuestSchemaModel){
    console.log('inside the function from validator function file ................'+email);
     try{
        //let Owner = new  OwnerSchemaModel(req.body);
        const isGuestExist = await GuestSchemaModel.findOne({email: email});
        if(isGuestExist) return true;
       
        return false;
    
    }catch(e){
        console.log('error inside checkGuestExist ', e.message)
        return true;
    }
}

module.exports = {checkGuestExist, checkGuestLoginCred, checkGuestExistForUpdate};