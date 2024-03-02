const accountController = require('../controllers/account_controller');
const accountRouter = require('./routes');

accountRouter.post('/markedAsPaid', accountController.markedAsPaid);
accountRouter.post('/fetchPaymentRecord', accountController.fetchPaymentRecord);
accountRouter.post('/sendOtp', accountController.sendOtp);
accountRouter.post('/removeGuest', accountController.removeGuest);

module.exports = accountRouter;