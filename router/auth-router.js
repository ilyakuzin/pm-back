const Router = require('express')
const controller = require('../controllers/auth-controller')
const {body} = require('express-validator')

const router = new Router()

router
    .post('/login', body('email').isEmail(), controller.login)
    .get('/logout', controller.logout)
    .get('/refresh', controller.refresh)

module.exports = router