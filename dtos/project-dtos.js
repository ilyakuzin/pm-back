module.exports = class ProjectDto {
    id
    manager
    status


    constructor(model) {
        this.id = model._id
        this.manager = model.manager
        this.status = model.status
    }


}