const Project = require('../models/project-model.js')
const apiError = require('../exceptions/api_errors')
const ProjectDto = require('../dtos/project-dtos')

class projectService {

    async create(name, managerID, workers, contract, comments, contractEvaluation, statusID, estimationInHour, relatedProjects) {
        const prName = await Project.findOne({name})
        if (prName) {
            throw apiError.BadRequest(`Проект с названием ${name} уже существует`)
        }
        if (estimationInHour < 0) {
            throw apiError.BadRequest(`Невозможное значение количества часов`)
        }
        const cost = contractEvaluation * estimationInHour
        const project = await Project.create({
            name, managerID, workers, contract, comments, contractEvaluation,
            cost, statusID, estimationInHour, relatedProjects
        })
        return project
    }

    async updateProject(name, managerID, workers, contract, comments,  contractEvaluation, statusID, estimationInHour, relatedProjects) {
        const project = await Project.findOne({name})
        if (!project) {
            throw apiError.BadRequest('Проект не найден')
        }
        if (name) {
            project.name = name
        }
        if (managerID) {
            project.managerID = managerID
        }
        if (workers) {
            project.workers = workers
        }
        if (contract) {
            project.contract = contract
        }
        if (contractEvaluation) {
            project.contractEvaluation = contractEvaluation
        }
        if (estimationInHour) {
            project.estimationInHour = estimationInHour
        }
        if (statusID) {
            //переделать статусы
            //проверка  должна быть, что такой статус существует
            project.statusID = statusID
        }
        if (comments) {
            project.comments = comments
        }
        if (relatedProjects) {
            project.relatedProjects = relatedProjects
        }
        project.cost = contractEvaluation * estimationInHour
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

    async getAllProjects() {
        const projects = await Project.find({}).sort({createdAt: -1})
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

    async getProjectByName(name) {
        const project = await Project.findOne({name})
        if (!project) {
            throw apiError.BadRequest('Проект не найден')
        }
        return project
    }

    async getProjectByManager(managerID) {
        const projects = await Project.findById({managerID: managerID})
        let updatedProjects = []
        projects.forEach(project => {
            const updatedProject = new Project(project)
            updatedProjects.push(updatedProject)
        })
        return updatedProjects
    }

    async getRelatedProjects(id) {
        const project = await Project.findById(id).populate('relatedProjects')
        if (!project) {
            throw apiError.BadRequest('Проект не найден')
        }
        return project
    }

    async sortByDate(projects) {
        return projects.sort({createdAt: 1})
    }

    async sortByDateRecent(projects) {
        return projects.sort({createdAt: -1})
    }



}

module.exports = new projectService()