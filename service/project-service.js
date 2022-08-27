const Project = require('../models/project-model.js')
const ProjectLog = require('../models/project-logs-model.js')
const apiError = require('../exceptions/api_errors')
const Status = require('../models/status-model.js')
const ProjectDto = require('../dtos/project-dtos')


class projectService {

    async create(name, manager, developers, designers, deadline, comments, status, evaluationOfProject, evaluationByHour, cost, relatedProjects) {
        const candidate = await Project.findOne({name})
        if (candidate) {
            throw apiError.BadRequest(`Проект с названием ${name} уже существует`)
        }
        if (evaluationByHour < 0) {
            throw apiError.BadRequest(`Невозможное значение количества часов`)
        }
        if (!cost) {
            cost = evaluationOfProject * evaluationByHour
        }
        const project = await Project.create({
            name,
            manager,
            developers,
            designers,
            deadline,
            comments,
            evaluationOfProject,
            evaluationByHour,
            percentageDifference: 1,
            profit: evaluationByHour * evaluationOfProject,
            cost,
            status: await Status.findOne({statusName: status}),
            relatedProjects
        })
        const projectDto = new ProjectDto(project)
        return projectDto
    }


    async updateProject(projectId, changedByManager, name, managerId, developers, designers, deadline, comments, evaluationOfProject,
                        evaluationByHour, cost, status, relatedProjects) {
        const project = await Project.findById(projectId)
        if (!project) {
            throw apiError.BadRequest('Проект не найден')
        }
        const projectLog = await ProjectLog.create({
            projectId,
            changedByManager,
        })
        if (name) {
            projectLog.late.name = project.name
            projectLog.actual.name = name
            project.name = name
        }
        if (managerId) {
            projectLog.manager_late = project.manager
            projectLog.manager_actual = managerId
            project.manager = managerId
        }
        if (developers) {
            projectLog.developers_late = project.developers
            projectLog.developers_actual = developers
            project.developers = developers
        }
        if (designers) {
            projectLog.designers_late = project.designers
            projectLog.designers_actual = designers
            project.designers = designers
        }
        if (deadline) {
            projectLog.late.deadline = project.deadline
            projectLog.actual.deadline = deadline
            project.deadline = deadline
        }
        if (evaluationOfProject) {
            projectLog.late.evaluationOfProject = project.evaluationOfProject
            projectLog.actual.evaluationOfProject = evaluationOfProject
            project.evaluationOfProject = evaluationOfProject
        }
        if (evaluationByHour) {
            projectLog.late.evaluationByHour = project.evaluationByHour
            projectLog.actual.evaluationByHour = evaluationByHour
            project.evaluationByHour = evaluationByHour
        }
        // if (wastedHours) {
        //     projectLog.late.wastedHours = project.wastedHours
        //     projectLog.actual.wastedHours = wastedHours
        //     project.wastedHours = wastedHours
        // }
        if (status) {
            const projectStatus = await Status.findOne({statusName: status})
            if (!projectStatus) {
                throw apiError.BadRequest('Статус не найден')
            }
            projectLog.status_late = await Status.findOne(project.status)
            projectLog.status_actual = projectStatus
            project.status = projectStatus
        }
        if (comments) {
            projectLog.late.comments = project.comments
            let projectComments = project.comments
            projectComments.push(comments)
            projectLog.actual.comments = projectComments
            project.comments = projectComments
        }
        if (relatedProjects) {
            projectLog.relatedProjects_late = project.relatedProjects
            let projects = project.relatedProjects
            projects.push(relatedProjects)
            projectLog.relatedProjects_actual = projects
            project.relatedProjects = projects
        }
        if (cost) {
            projectLog.late.cost = project.cost
            projectLog.actual.cost = cost
            project.cost = cost
        } else {
            if (evaluationByHour && evaluationOfProject) {
                projectLog.late.cost = project.cost
                project.cost = evaluationByHour * evaluationOfProject
                projectLog.actual.cost = project.cost
            } else if (evaluationOfProject && !evaluationOfProject) {
                projectLog.late.cost = project.cost
                project.cost = evaluationOfProject * project.evaluationOfProject
                projectLog.actual.cost = project.cost
            } else if (!evaluationOfProject && evaluationOfProject) {
                projectLog.late.cost = project.cost
                project.cost = project.evaluationOfProject * evaluationOfProject
                projectLog.actual.cost = project.cost
            }
        }
        projectLog.late.percentageDifference = (project.evaluationOfProject - project.wastedHours) / project.evaluationOfProject
        projectLog.actual.percentageDifference = (project.evaluationOfProject - project.wastedHours) / project.evaluationOfProject
        project.percentageDifference = (project.evaluationOfProject - project.wastedHours) / project.evaluationOfProject
        let projectLogs = project.projectHistory
        projectLogs.push(projectLog)
        project.projectHistory = projectLogs
        await projectLog.save()
        await project.save()
        return new ProjectDto(project)
    }

    async deleteProject(id) {
        const project = await Project.findByIdAndDelete(id)
        if (!project) {
            throw apiError.BadRequest('Проект не найден')
        }
        return project
    }

    async getAllProjects(manager, status, deadline) {
        let projects
        if (manager) {
            if (status) {
                if (deadline) {
                    projects = await Project.find({
                        manager: manager,
                        status: status,
                        deadline: deadline
                    }).populate('manager', 'surname firstName secondName avatar')
                        .populate('developers', 'surname firstName secondName avatar')
                        .populate('designers', 'surname firstName secondName avatar')
                        .populate('status')
                } else {
                    projects = await Project.find({
                        manager: manager,
                        status: status
                    })
                        .populate('manager', 'surname firstName secondName avatar')
                        .populate('developers', 'surname firstName secondName avatar')
                        .populate('designers', 'surname firstName secondName avatar')
                        .populate('status')
                }
            } else {
                if (deadline) {
                    projects = await Project.find({
                        manager: manager,
                        deadline: deadline
                    })
                        .populate('manager', 'surname firstName secondName avatar')
                        .populate('developers', 'surname firstName secondName avatar')
                        .populate('designers', 'surname firstName secondName avatar').populate('status')
                } else {
                    projects = await Project.find({manager: manager})
                        .populate('manager', 'surname firstName secondName avatar')
                        .populate('developers', 'surname firstName secondName avatar')
                        .populate('designers', 'surname firstName secondName avatar')
                        .populate('status')
                }
            }
        } else {
            if (status) {
                if (deadline) {
                    projects = await Project.find({
                        status: status,
                        deadline: deadline
                    }).populate('manager', 'surname firstName secondName avatar').populate('developers', 'surname firstName secondName avatar').populate('designers', 'surname firstName secondName avatar').populate('status')
                } else {
                    projects = await Project.find({status: status}).populate('manager', 'surname firstName secondName avatar').populate('developers', 'surname firstName secondName avatar').populate('designers', 'surname firstName secondName avatar').populate('status')
                }
            } else {
                if (deadline) {
                    projects = await Project.find({deadline: deadline}).populate('manager', 'surname firstName secondName avatar').populate('developers', 'surname firstName secondName avatar').populate('designers', 'surname firstName secondName avatar').populate('status')
                } else {
                    projects = await Project.find({}).populate('manager', 'surname firstName secondName avatar').populate('developers', 'surname firstName secondName avatar').populate('designers', 'surname firstName secondName avatar').populate('status')
                }
            }
        }
        let updatedProjects = []
        projects.forEach(project => {
            const updatedProject = new ProjectDto(project)
            updatedProjects.push(updatedProject)
        })
        return updatedProjects
    }

    async getProjectById(id) {
        const project = await Project.findById(id)
            .populate('relatedProjects status')
            .populate('developers', 'surname firstName secondName avatar')
            .populate('designers', 'surname firstName secondName avatar')
        //.populate('projectHistory')
        if (!project) {
            throw apiError.BadRequest('Проект не найден')
        }
        return project
    }

    async getProjectHistory(id) {
        const projectHistory = await ProjectLog.find({projectId: id})
            .populate('changedByManager', 'firstName secondName surname avatar')
            .populate('manager_actual', 'firstName secondName surname')
            .populate('manager_late', 'firstName secondName surname')
            .populate('developers_actual', 'firstName secondName surname')
            .populate('developers_late', 'firstName secondName surname')
            .populate('designers_actual', 'firstName secondName surname')
            .populate('designers_late', 'firstName secondName surname')
            .populate('status_actual')
            .populate('status_late')
            .populate('relatedProjects_actual', 'name')
            .populate('relatedProjects_late', 'name')
            .populate('actual late')

        // for (const projectHistoryElement of projectHistory) {
        //     console.log(projectHistoryElement)
        //     console.log("----------------------------------")
        // }
        // .populate('manager', 'firstName secondName avatar')
        // .populate('developers', 'surname firstName secondName avatar')
        // .populate('designers', 'surname firstName secondName avatar')
        // .populate('status relatedProjects')
        return projectHistory
    }

    async getRelatedProjects(id) {
        const project = await Project.findById(id).populate('manager developers designers relatedProjects status')
        if (!project) {
            throw apiError.BadRequest('Проект не найден')
        }
        return new ProjectDto(project)
    }

    async getUserProjects(id) {
        const projects = await Project.find({developers: id}).populate('manager developers designers relatedProjects status')
        let updatedProjects = []
        projects.forEach(project => {
            const updatedProject = new ProjectDto(project)
            updatedProjects.push(updatedProject)
        })
        return updatedProjects
    }
}

module.exports = new projectService()
