const {validationResult} = require('express-validator')
const projectService = require('../service/project-service')
const apiError = require('../exceptions/api_errors')

class projectController {

    //@desc   create new project
    //@route  POST api/projects/create
    //@access
    async create(req, res, next) {
        try {
            const {
                name,
                manager,
                developers,
                designers,
                deadline,
                comments,
                status,
                evaluationOfProject,
                evaluationByHour,
                cost,
                relatedProjects
            } = req.body
            const projectData = await projectService.create(name, manager, developers, designers, deadline, comments,
                status, evaluationOfProject, evaluationByHour, cost, relatedProjects)
            return res.json(projectData)
        } catch (e) {
            next(e)
        }
    }

    //@desc   Update project
    //@route  PUT /api/projects/:id
    //@access
    async updateProject(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                next(apiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const projectId = req.params.id
            const changedById = req.user.id
            const {
                name,
                manager,
                developers,
                designers,      //wastedHours
                deadline,
                comments,
                evaluationOfProject,
                evaluationByHour,
                cost,
                status,
                relatedProjects
            } = req.body
            const projectData = await projectService.updateProject(projectId, changedById, name, manager,
                developers, designers, deadline, comments, evaluationOfProject, evaluationByHour, cost, status, relatedProjects)
            return res.json(projectData)
        } catch (e) {
            next(e)
        }
    }

    //@desc   Delete project
    //@route  DELETE /api/projects/:id
    //@access
    async deleteProject(req, res, next) {
        try {
            const _id = req.params.id
            const project = await projectService.deleteProject(_id)
            return res.json(project)
        } catch (e) {
            next(e)
        }
    }

    // @desc     Get project by id
    // @route    GET /api/projects/:id
    // @access
    async getProjectById(req, res, next) {
        try {
            const _id = req.params.id
            const project = await projectService.getProjectById(_id)
            return res.json(project)
        } catch (e) {
            next(e)
        }
    }
    // @desc     Get project history
    // @route    GET /api/projects/:id/history
    // @access
    async getProjectHistory(req, res, next) {
        try {
            const _id = req.params.id
            const history = await projectService.getProjectHistory(_id)
            return res.json(history)
        } catch (e) {
            next(e)
        }
    }

    // @desc     Get all projects
    // @route    GET /api/projects/
    // @access
    async getAllProjects(req, res, next) {
        try {
            const manager = req.query.manager
            const status = req.query.status
            const deadline = req.query.deadline
            const projects = await projectService.getAllProjects(manager, status, deadline)
            return res.json(projects)
        } catch (e) {
            next(e)
        }
    }

    // @desc    Get related projects
    // @route   GET /api/projects/:id
    // @access
    async getRelatedProjects(req, res, next) {
        try {
            const projects = await projectService.getRelatedProjects(req.params.id)
            return res.json(projects)
        } catch (e) {
            next(e)
        }
    }

    // @desc    Get user projects
    // @route   GET /api/projects/my
    // @access
    async getUserProjects(req, res, next) {
        try {
            const userId = req.user.id
            const projectsData = await projectService.getUserProjects(userId)
            res.json(projectsData)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new projectController()
