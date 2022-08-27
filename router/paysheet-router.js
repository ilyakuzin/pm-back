const Router = require('express')
const controller = require('../controllers/paysheet-controller')
const allow = require('../middleware/role-middleware')
const authMiddleware = require('../middleware/auth-middleware')

const router = new Router

router
    .post('/rate/add', controller.addUserRate)
    .post('/', allow('ADMIN'), controller.addPrepaymentVacationAward)
    .get('/', allow('ADMIN'), controller.getPaysheet)

router.route('/prepayments/:id')
    .put(allow('ADMIN'), controller.updatePrepayment)
    .delete(allow('ADMIN'), controller.deletePrepayment)

router.route('/vacations/:id')
    .put(allow('ADMIN'), controller.updateVacation)
    .delete(allow('ADMIN'), controller.deleteVacation)

router.route('/awards/:id')
    .put(allow('ADMIN'), controller.updateAward)
    .delete(allow('ADMIN'), controller.deleteAward)

module.exports = router