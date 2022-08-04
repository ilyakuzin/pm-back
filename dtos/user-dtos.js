module.exports = class UserDto {
    id
    firstName
    secondName
    surname
    email
    phone
    tgLogin
    avatar
    roles
    isActivated

    constructor(model) {
        this.id = model._id
        this.firstName = model.firstName
        this.secondName = model.secondName
        this.surname = model.surname
        this.email = model.email
        this.phone = model.phone
        this.tgLogin = model.tgLogin
        this.avatar = model.avatar
        this.roles = model.roles
        this.isActivated = model.isActivated

    }
}