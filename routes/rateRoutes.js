const rateController = require('../controllers/rate_controller');
const rateRouter = require('./routes');

rateRouter.post('/rateTheOwner', rateController.rateTheOwner);
rateRouter.get('/fetchTheRate', rateController.fetchTheRate);

module.exports = rateRouter;