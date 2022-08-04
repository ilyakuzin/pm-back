const Router = require('express')
const controller = require('../controllers/project-controller.js')
const allow = require('../middleware/role-middleware')

const router = new Router()

router
    .post('/create', allow(['ADMIN', 'MANAGER']), controller.create)
    .get('/', allow(['ADMIN', 'MANAGER']), controller.getAllProjects)

router.route('/:id')
    .get(controller.getProjectById)
    .put(allow(['ADMIN', 'MANAGER']), controller.updateProject)
    .delete(allow(['ADMIN']), controller.deleteProject)

router.route('/sort')
    .get(controller.sortByDate)

router.route('/:id/related-projects')
    .get(allow(['ADMIN', 'MANAGER']), controller.getRelatedProjects)


module.exports = router