const ownerController = require('../controllers/owner_controller')
const ownerRouter = require('./routes');
const ownerUpload = require('../middleware/ownerUpload');
const hostleUpload = require('../middleware/hostleUpload');
const auth = require('../middleware/auth');




ownerRouter.post('/registerOwner',ownerController.registerOwner);
ownerRouter.post('/loginOwner', ownerController.loginOwner);
ownerRouter.get('/ownerProfile',auth.authenticateToken, ownerController.ownerProfile);
ownerRouter.put('/updateOwner', ownerController.updateOwner);
ownerRouter.delete('/deleteOwner', ownerController.deleteOwner);
ownerRouter.post('/sendOtpForgotPasswordForOwner', ownerController.sendOtpForgotPasswordForOwner);
ownerRouter.post('/verifyOtpAndUpdatePasswordForOwner', ownerController.verifyOtpAndUpdatePasswordForOwner);

ownerRouter.put('/uploadOwnerProfilePic', ownerUpload.single('profilePic'), ownerController.uploadOwnerProfilePic);
ownerRouter.delete('/deleteOwnerProfilePic', ownerController.deleteOwnerProfilePic);

ownerRouter.put('/uploadOwnerHostlePic', hostleUpload.single('ownerHostlePic'), ownerController.uploadOwnerHostlePic);
ownerRouter.delete('/deleteOwnerHostlePic', ownerController.deleteOwnerHostlePic);

ownerRouter.post('/sendVerificationMailForOwner',ownerController.sendVerificationMailForOwner);
ownerRouter.post('/verifyOtpForOwner', ownerController.verifyOtpForOwner);

ownerRouter.post('/rateTheOwner', ownerController.rateTheOwner);
ownerRouter.post('/updateRating',ownerController.updateRating);








ownerRouter.post('/fetchTheOwnerDetails',ownerController.fetchTheOwnerDetails);


module.exports = ownerRouter;

