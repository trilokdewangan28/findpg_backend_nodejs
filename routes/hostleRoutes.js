const hostleController = require('../controllers/hostle_controller');
const hostleRouter = require('./routes');





hostleRouter.get('/fetchHostle', hostleController.fetchHostle);
hostleRouter.post('/bookHostle',hostleController.bookHostle);
hostleRouter.post('/unBookHostle',hostleController.unBookHostle);

hostleRouter.post('/sendOtpForBook',hostleController.sendOtpForBook);
hostleRouter.post('/verifyOtpAndBook', hostleController.verifyOtpAndBook);

hostleRouter.post('/sendOtpForUnbook', hostleController.sendOtpForUnbook);
hostleRouter.post('/verifyOtpAndUnbook', hostleController.verifyOtpAndUnbook);

hostleRouter.post('/unbookGuestForOwner', hostleController.unbookGuestForOwner);
module.exports = hostleRouter;


// hostleRouter.put('/uploadOwnerHostlePic', upload.single('ownerHostlePic') , async(req, res)=>{
//     try {
//         const email = req.body.email;
//         const ownerHostlePic = req.file.filename;
//          console.log(ownerHostlePic);
//         // Update the user document with the profile picture filename or URL
//         const updatedUser = await OwnerSchemaModel.findOneAndUpdate(
//           {email:email},
//           { $push: { ownerHostlePic: ownerHostlePic } },
//           { new: true }
//         );
    
//         res.status(200).json({ message: 'hostle image uploaded successfully', user: updatedUser });
//       } catch (err) {
//         console.error('Error uploading hostle images:', err);
//         res.status(500).json({ message: 'An error occurred during hostle images upload' });
//       }
// });
