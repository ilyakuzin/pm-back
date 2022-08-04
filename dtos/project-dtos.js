module.exports = class ProjectDto {
    id
    managerID
    status


    constructor(model) {
        this.id = model._id
        this.managerID = model.managerID
        this.status = model.status
    }


}