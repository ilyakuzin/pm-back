const Project = require('../models/project-model.js')
const apiError = require('../exceptions/api_errors')
const Status = require('../models/status-model.js')

//import {STATUSES} from "../models/status-model";


class projectService {

    async create(name, manager, developers, designers, deadline, comments, status, evaluationOfProject, evaluationByHour, relatedProjects) {
        const candidate = await Project.findOne({name})
        if (candidate) {
            throw apiError.BadRequest(`Проект с названием ${name} уже существует`)
        }
        if (evaluationByHour < 0) {
            throw apiError.BadRequest(`Невозможное значение количества часов`)
        }
        const cost = evaluationOfProject * evaluationByHour
        const project = await Project.create({
            name, manager, developers, designers, deadline, comments, evaluationOfProject, evaluationByHour,
            cost, status: await Status.findOne({statusName: status}), relatedProjects
        })
        return project
    }

    async updateProject(name, manager, developers, designers, deadline, comments, evaluationOfProject,
                        wastedHours, evaluationByHour, status, relatedProjects) {
        const project = await Project.findOne({name})
        if (!project) {
            throw apiError.BadRequest('Проект не найден')
        }
        if (name) {
            project.name = name
        }
        if (manager) {
            project.manager = manager
        }
        if (developers) {
            project.developers = developers
        }
        if (designers) {
            project.designers = designers
        }
        if (deadline) {
            project.deadline = deadline
        }
        if (evaluationOfProject) {
            project.evaluationOfProject = evaluationOfProject
        }
        if (evaluationByHour) {
            project.evaluationByHour = evaluationByHour
        }
        if (wastedHours) {
            project.wastedHours = wastedHours
        }
        if (status) {
            const projectStatus = await Status.findOne({statusName: status})
            project.status = projectStatus
        }
        if (comments) {
            project.comments = comments
        }
        if (relatedProjects) {
            project.relatedProjects = relatedProjects
        }
        project.cost = evaluationByHour * evaluationOfProject
        //для подсчета прибыли нужна ставка разработчика
        await project.save()
        return project
    }

    async deleteProject(id) {
        const project = await Project.findByIdAndDelete(id)
        if (!project) {
            throw apiError.BadRequest('Проект не найден')
        }
        return project
    }

    async getAllProjects(managerID) {
        let projects
        if (!managerID) {
            projects = await Project.find({})
        } else {
            projects = await Project.find({managerID})
        }
        let updatedProjects = []
        projects.forEach(project => {
            const updatedProject = new Project(project)
            updatedProjects.push(updatedProject)
        })
        return updatedProjects
    }

    async getProjectById(id) {
        const project = await Project.findById(id).populate('relatedProjects')
        if (!project) {
            throw apiError.BadRequest('Проект не найден')
        }
        return project
    }

    async getRelatedProjects(id) {
        const project = await Project.findById(id).populate('relatedProjects')
        if (!project) {
            throw apiError.BadRequest('Проект не найден')
        }
        return project
    }

}

module.exports = new projectService()