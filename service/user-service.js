const User = require('../models/user-model.js')
const Role = require('../models/role-model.js')
const tokenService = require('./token-service')
const mailService = require('./mail-service')
const fs = require('fs')
const apiError = require('../exceptions/api_errors')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const UserDto = require('../dtos/user-dtos')
const UserRate = require('../models/userRate-model')

class userService {

    async invite(firstName, secondName, surname, email, phone, tgLogin, roles) {
        const candidate = await User.findOne({email})
        if (candidate) {
            throw apiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`)
        }
        const userRole = await Role.findOne({value: roles})
        const activationLink = uuid.v4()
        const activationExpires = Date.now() + 86400000
        const user = await User.create({
            firstName, secondName, surname, email, phone, tgLogin,
            roles: [userRole.value], activationLink, activationExpires
        })
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/users/registration/${activationLink}`)
        const userDto = new UserDto(user) // id, email, roles, isActivated
        return {user: userDto}
    }

    async settingPassword(activationLink, password, verifyPassword) {
        const user = await User.findOne({activationLink, activationExpires: {$gt: Date.now()}})
        if (!user) {
            throw apiError.BadRequest('Некоректная ссылка активации (срок действия ссылки мог закончиться)')
        }
        if (password === verifyPassword) {
            const hashPassword = bcrypt.hashSync(password, 7)
            user.password = hashPassword
            user.isActivated = true
            user.activationLink = undefined
            user.activationExpires = undefined
            const updatedUser = await user.save()
            const userDto = new UserDto(updatedUser) // id, email, roles, isActivated
            const tokens = tokenService.generateTokens({...userDto})
            await tokenService.saveToken(userDto.id, tokens.refreshToken)
            return {...tokens, user: userDto}
        } else {
            throw apiError.BadRequest('Пароли не совпадают')
        }
    }

    async updateUser(id, email, password, phone, tgLogin, firstName, secondName, surname, roles) {
        const user = await User.findById(id)
        if (!user) {
            throw apiError.BadRequest('Пользователь не найден')
        }
        if (password) {
            const hashPassword = bcrypt.hashSync(password, 7)
            user.password = hashPassword
        }
        if (roles) {
            const userRole = await Role.findOne({value: roles})
            user.roles = userRole.value
        }
        if (firstName) {
            user.firstName = firstName
        }
        if (secondName) {
            user.secondName = secondName
        }
        if (surname) {
            user.surname = surname
        }
        if (email) {
            user.email = email
        }
        if (phone) {
            user.phone = phone
        }
        if (tgLogin) {
            user.tgLogin = tgLogin
        }
        const updateUser = await user.save()
        const userDto = new UserDto(updateUser) // id, email, roles
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }


    async getAllUsers(role) {
        let users
        if (role) {
            users = await User.find({roles: role})
        } else {
            users = await User.find({})
        }
        let updatedUsers = []
        for (const user of users) {
            const updatedUser = new UserDto(user)
            const userRate = await UserRate.findOne({userId: updatedUser.id}).sort({date:-1})
                .select('value')
            if (!userRate) {
                updatedUsers.push({user: updatedUser, rate: 'Ставка еще не назначена'})
            } else {
                updatedUsers.push({user: updatedUser, rate: userRate.value})
            }
        }
        return updatedUsers
    }

    async getOneUser(id) {
        const user = await User.findById(id)
        if (!user) {
            throw apiError.BadRequest('Пользователь не найден')
        }
        const updatedUser = new UserDto(user)
        const userRate = await UserRate.findOne({userId: updatedUser.id}).sort({date:-1})
            .select('value')
        if(!userRate){
            return {user: updatedUser, rate: 'Ставка еще не назначена'}
        }else{
            return {user: updatedUser, rate: userRate.value}
        }
    }

    async deleteUser(id) {
        const user = await User.findByIdAndDelete(id)
        if (!user) {
            throw apiError.BadRequest('Пользователь не найден')
        }
        return user
    }

    async uploadAvatar(id, file, path) {
        const user = await User.findById(id)
        if (user.avatar) {
            fs.unlinkSync(path + '\\' + user.avatar)
        }
        const avatarName = uuid.v4() + '.jpg'
        await file.mv(path + '\\' + avatarName)
        user.avatar = avatarName
        await user.save()
        const userDto = new UserDto(user)
        return userDto
    }

    async deleteAvatar(id, path) {
        const user = await User.findById(id)
        fs.unlinkSync(path + '\\' + user.avatar)
        user.avatar = null
        await user.save()
        const userDto = new UserDto(user)
        return userDto
    }

}

module.exports = new userService()