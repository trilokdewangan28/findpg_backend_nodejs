// ---------------------------------------CHECK OWNER EXISTENCE-----------------------------------
async function checkUserExist(email, UserSchemaModel){
    console.log('inside the function from validator function file ................'+email);
     try{
        const isUserExist = await UserSchemaModel.findOne({email: email});
        
        if(isUserExist) return true;
       
        return false;
    
    }catch(e){
        console.log('error inside checkUserExist ', e.message)
        return false;
    }
}




//---------------------------------------------CHECK OWNER LOGIN CREDENTIALS----------------------------------------
async function checkOwnerLoginCred(model, OwnerSchemaModel){
    console.log('inside the function from validator function file ................'+model.email, model.password);
     try{
        const isCredCorrect = await OwnerSchemaModel.findOne({email: model.email, password: model.password});
        if(isCredCorrect) return true;
       
        return false;
    
    }catch(e){
        console.log('error inside checkGuestLoginCred ', e.message)
        return true;
    }
}

//-----------------------------------------------------------------------------check owner existes for update------------------------------------------------------------
async function checkOwnerExistForUpdate(email, OwnerSchemaModel){
    console.log('inside the function from validator function file ................'+email);
     try{
        //let Owner = new  OwnerSchemaModel(req.body);
        const isOwnerExist = await OwnerSchemaModel.findOne({email: email});
        if(isOwnerExist) return true;
       
        return false;
    
    }catch(e){
        console.log('error inside checkOwnerExist ', e.message)
        return true;
    }
}

module.exports = {checkUserExist, checkOwnerLoginCred, checkOwnerExistForUpdate};