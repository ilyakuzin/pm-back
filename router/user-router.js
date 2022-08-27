const Router = require('express')
const controller = require('../controllers/user-controller')
const {body} = require('express-validator')
const allow = require('../middleware/role-middleware')
const authMiddleware = require('../middleware/auth-middleware')

const router = new Router()

router
    .post('/invite', allow('ADMIN'),
        body('email').isEmail(),
        controller.invite )
    .get('/', allow( ['ADMIN', 'MANAGER']), controller.getAllUsers)

router.put('/update/me', authMiddleware,
    body('email').isEmail(),
    body('password').matches(/^(\s*|(?=.*\d)(?=.*[A-Z])[0-9a-zA-Z]{8,})$/),
    controller.updateMyBio)

router.route('/avatar')
    .post(authMiddleware, controller.uploadAvatar)
    .delete(authMiddleware, controller.deleteAvatar)

router.route('/:id')
    .get(allow(['ADMIN', 'MANAGER']), controller.getOneUser)
    .put(allow( ['ADMIN']),
        body('email').isEmail(),
        body('password').matches(/^(\s*|(?=.*\d)(?=.*[A-Z])[0-9a-zA-Z]{8,})$/),
        controller.updateUser)
    .delete(allow('ADMIN'), controller.deleteUser)

router.route('/registration/:link')
    .get(controller.activate)
    .post(body('password').matches(/^(\s*|(?=.*\d)(?=.*[A-Z])[0-9a-zA-Z]{8,})$/), controller.settingPassword)


module.exports = router