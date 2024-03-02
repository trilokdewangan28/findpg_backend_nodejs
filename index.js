const express = require('express');
const app = express();
const error = require('./middleware/error');
// const routes = require('./routes/routes');
const ownerRoutes = require('./routes/ownerRoutes');
const guestRoutes = require('./routes/guestRoutes');
const hostleRoutes = require('./routes/hostleRoutes');
const accountRoutes = require('./routes/accountRoutes');
const rateRoutes = require('./routes/rateRoutes');

require('./config/db');
app.use(express.json());
app.use('/uploads',express.static('uploads'));


app.use('/ownerApi/', ownerRoutes);
app.use('/guestApi/', guestRoutes);
app.use('/hostleApi/', hostleRoutes);
app.use('/accountApi', accountRoutes);
//app.use('/rateApi', rateRoutes);

app.use('/hostleApi/accessHostleImages', (req, res, next) => {
  // Serve the static image file
  express.static('ownerUploads/hostlePic')(req, res, (err) => {
    if (err) {
      console.error('Error serving the image:', err);
      // You can customize the error response as needed
      res.status(500).send('Error serving the image');
    }
  });
});

app.use('/ownerApi/accessOwnerProfilePic', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache');

  // Serve the static image file
  express.static('ownerUploads/ownerProfilePic')(req, res, (err) => {
    if (err) {
      console.error('Error serving the image:', err);
      // You can customize the error response as needed
      res.status(500).send('Error serving the image');
    }
  });
});

app.use('/guestApi/accessGuestProfilePic', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache');

  // Serve the static image file
  express.static('guestUploads/guestProfilePic')(req, res, (err) => {
    if (err) {
      console.error('Error serving the image:', err);
      // You can customize the error response as needed
      res.status(500).send('Error serving the image');
    }
  });
});



app.use(error.errorHandler);

app.listen(3000, ()=>{
    console.log('server listening on port 3000');
});
//console.log(Date.now());


module.exports = express;