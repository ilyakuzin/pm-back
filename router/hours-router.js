const Router = require('express')
const controller = require('../controllers/hours-controller')
const authMiddleware = require('../middleware/auth-middleware')

const router = new Router

router.post('/add', authMiddleware, controller.addHours)
router.get('/my', authMiddleware, controller.getHours)
router.put('/update/:id', authMiddleware, controller.updateHours)
router.delete('/delete/:id', authMiddleware, controller.deleteHours)

module.exports = router