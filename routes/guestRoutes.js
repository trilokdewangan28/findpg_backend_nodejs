const guestController = require('../controllers/guest_controller')
const guestRouter = require('./routes');
const guestUpload = require('../middleware/guestUpload');
const auth = require('../middleware/auth');



guestRouter.post('/registerGuest', guestController.registerGuest);
guestRouter.post('/loginGuest', guestController.loginGuest);
g

guestRouter.put('/updateGuest', guestController.updateGuest);
guestRouter.delete('/deleteGuest', guestController.deleteGuest);
guestRouter.post('/sendOtpForgotPasswordForGuest', guestController.sendOtpForgotPasswordForGuest);
guestRouter.post('/verifyOtpAndUpdatePasswordForGuest', guestController.verifyOtpAndUpdatePasswordForGuest);

guestRouter.put('/uploadGuestProfilePic', guestUpload.single('profilePic'), guestController.uploadGuestProfilePic);
guestRouter.delete('/deleteGuestProfilePic', guestController.deleteGuestProfilePic);

guestRouter.post('/fetchBookedGuestDetails', guestController.fetchBookedGuestDetails);

guestRouter.post('/sendVerificationMailForGuest',guestController.sendVerificationMailForGuest);
guestRouter.post('/verifyOtpForGuest', guestController.verifyOtpForGuest);



module.exports = guestRouter;


// guestRouter.put('/uploadGuestProfilePic', upload.single('guestProfilePic') , async(req, res)=>{
//     try {
//         const email = req.body.email;
//         const guestProfilePic = req.file.filename;
//          console.log(guestProfilePic);
//         // Update the user document with the profile picture filename or URL
//         const updatedUser = await GuestSchemaModel.findOneAndUpdate(
//           {email:email},
//           { profilePic: guestProfilePic }
//         );
    
//         res.status(200).json({ message: 'Profile picture uploaded successfully', user: updatedUser });
//       } catch (err) {
//         console.error('Error uploading profile picture:', err);
//         res.status(500).json({ message: 'An error occurred during profile picture upload' });
//       }
// });
