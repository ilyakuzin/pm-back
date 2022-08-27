const Router = require('express')
const controller = require('../controllers/project-controller.js')
const allow = require('../middleware/role-middleware')
const authMiddleware = require('../middleware/auth-middleware')

const router = new Router()

router.get('/my', authMiddleware, controller.getUserProjects)

router
    .post('/create', allow(['ADMIN', 'MANAGER']), controller.create)
    .get('/', allow(['ADMIN', 'MANAGER']), controller.getAllProjects)

router.route('/:id')
    .get(controller.getProjectById)
    .put(allow(['ADMIN', 'MANAGER']), authMiddleware,  controller.updateProject)
    .delete(allow(['ADMIN']), controller.deleteProject)

router.route('/:id/history')
    .get(allow(['ADMIN', 'MANAGER']), controller.getProjectHistory)

router.route('/:id/related-projects')
    .get(allow(['ADMIN', 'MANAGER']), controller.getRelatedProjects)



module.exports = router
