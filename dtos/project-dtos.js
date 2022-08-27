module.exports = class ProjectDto {
    id
    name
    manager
    status
    deadline
    evaluationByHour
    evaluationOfProject
    wastedHours
    designers
    developers

    constructor(model) {
        this.id = model._id
        this.name = model.name
        this.manager = model.manager
        this.status = model.status
        this.deadline = model.deadline
        this.evaluationByHour = model.evaluationByHour
        this.evaluationOfProject = model.evaluationOfProject
        this.wastedHours = model.wastedHours
        this.designers = model.designers
        this.developers = model.developers
    }


}