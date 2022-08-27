const Router = require('express')
const controller = require('../controllers/hours-controller')
const authMiddleware = require('../middleware/auth-middleware')
const allow = require('../middleware/role-middleware')
const {body} = require('express-validator')

const router = new Router

router
    .post('/add',
    body('quantity').matches(/^([0-9]|1[0-5])(?:\.\d{1,2})?$/),
    authMiddleware, controller.addHours)
    .get('/', allow(['ADMIN']), controller.getAllHours)
    .get('/my', authMiddleware, controller.getHours)
    .put('/update/:id',
    body('quantity').matches(/^([0-9]|1[0-5])(?:\.\d{1,2})?$/),
    authMiddleware, controller.updateHours)
    .delete('/delete/:id', authMiddleware, controller.deleteHours)

module.exports = router