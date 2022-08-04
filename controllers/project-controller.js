const {validationResult} = require('express-validator')
const projectService = require('../service/project-service')
const apiError = require('../exceptions/api_errors')

class projectController {

    //@desc   create new project
    //@route  POST api/projects/new
    //@access
    async create(req, res, next) {
        try {
            const {name, managerID, workers, contract, comments, statusID, estimationInHour, contractEvaluation} = req.body
            const projectData = await projectService.create(name, managerID, workers, contract, comments, statusID, estimationInHour, contractEvaluation)
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
            const {name, managerID, workers, contract, comments,  contractEvaluation, statusID, estimationInHour, relatedProjects} = req.body
            const projectData = await projectService.updateProject(name, managerID, workers, contract, comments,  contractEvaluation, statusID, estimationInHour, relatedProjects)
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

    // @desc     Get project by id
    // @route    GET /api/projects/:id
    // @access
    async getProjectByName(req, res, next) {
        try {
            const name = req.params.name
            const project = await projectService.getProjectByName(name)
            return res.json(project)
        } catch (e) {
            next(e)
        }
    }

    // @desc     Get all projects
    // @route    GET /api/projects/
    // @access
    async getAllProjects(req, res, next) {
        try {
            const projects = await projectService.getAllProjects()
            return res.json(projects)
        } catch (e) {
            next(e)
        }
    }

    // @desc    Get related projects
    // @route   GET /api/projects/:id
    // @access
    //переписать
    async getRelatedProjects(req, res, next) {
        try {
            const projects = await projectService.getRelatedProjects(req.params.id)
            return res.json(projects)
        } catch (e) {
            next(e)
        }
    }

    async sortByDate(req, res, next) {
        try {

        }
        catch (e) {

        }
    }

}

module.exports = new projectController()