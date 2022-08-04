const {validationResult} = require('express-validator')
const userService = require('../service/user-service')
const apiError = require('../exceptions/api_errors')
const User = require('../models/user-model')
const uuid = require('uuid')
const fs = require("fs");
const {ExpressFileuploadValidator} = require("express-fileupload-validator");

const expressFileuploadValidator = new ExpressFileuploadValidator({
    minCount: 1,
    maxCount: 1,
    allowedExtensions: ['jpg', 'png', 'gif'],
    allowedMimetypes: ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'],
    maxSize: '5MB',
}, {
    minCount: 'Слишком мало файлов, минимум {0}',
    maxCount: 'Слишком много файлов, максимум {0}',
    maxSize: 'Максимальный размер файла {0} равен {1} размер загружаемого файл {2}',
    allowedExtensions:
        'Файл {0} имеет недопустимое расширение {1}, допустимые расширения: {2}',
    disallowedExtensions:
        'Файл {0} имеет недопустимое расширение {1}, запрещенные расширения: {2}',
    allowedMimetypes:
        'Файл {0} имеет недопустимый mime-тип {1}, разрешенные типы: {2}',
    disallowedMimetypes:
        'Файл {0} имеет недопустимый mime-тип {1}, запрещенные типы: {2}',
})

class userController {

// @desc     Invite new user
// @route    POST /api/users/invite
// @access   Private
    async invite(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                next(apiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {firstName, secondName, surname, email, phone, tgLogin, roles} = req.body
            const userData = await userService.invite(firstName, secondName, surname, email, phone, tgLogin, roles)
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

// @desc     Activate account
// @route    GET /api/users/activate/:link
// @access   Private
    async activate(req, res, next) {
        try {
            return res.redirect(process.env.CLIENT_URL)
        } catch (e) {
            next(e)
        }
    }

// @desc     Setting password account
// @route    POST /api/users/activate/:link
// @access   Private
    async settingPassword(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                next(apiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const activationLink = req.params.link
            const {password, verifyPassword} = req.body
            const userData = await userService.settingPassword(activationLink, password, verifyPassword)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

// @desc     Update user
// @route    PUT /api/users/:id
// @access   Private
    async updateUser(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                next(apiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const _id = req.params.id
            const {firstName, secondName, surname, email, password, phone, tgLogin, roles} = req.body
            const userData = await userService.updateUser(_id, email, password, phone, tgLogin, firstName, secondName, surname, roles)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

// @desc     Update my bio
// @route    PUT /api/users/update/me
// @access   Private
    async updateMyBio(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                next(apiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const id = req.user.id
            const {email, password, phone, tgLogin} = req.body
            const userData = await userService.updateUser(id, email, password, phone, tgLogin)
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

// @desc     Get all users
// @route    GET /api/users/
// @access   Private
    async getAllUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers()
            return res.json(users)
        } catch (e) {
            next(e)
        }
    }

// @desc     Get one user
// @route    GET /api/users/:id
// @access   Private
    async getOneUser(req, res, next) {
        try {
            const _id = req.params.id
            const user = await userService.getOneUser(_id)
            return res.json(user)
        } catch (e) {
            next(e)
        }
    }

// @desc     Delete user
// @route    GET /api/users/:id
// @access   Private
    async deleteUser(req, res, next) {
        try {
            const _id = req.params.id
            const user = await userService.deleteUser(_id)
            return res.json(user)
        } catch (e) {
            next(e)
        }
    }

// @desc Upload avatar
// @route Post /api/users/avatar
// @access Private
    async uploadAvatar(req, res, next) {
        try {
            expressFileuploadValidator.validate(req.files.file)
            const file = req.files.file
            const id = req.user.id
            const userData = await userService.uploadAvatar(id, file)
            return res.json(userData)
        } catch (e) {
            res.status(400).json({message: e.errors})
            next(e)
        }
    }

// @desc Delete avatar
// @route Delete /api/users/avatar
// @access Private
    async deleteAvatar(req, res, next) {
        try {
            const id = req.user.id
            // const userData = await userService.deleteAvatar(id)
            const user = await User.findById(id)
            fs.unlinkSync(process.env.STATIC_PATH + '\\' + user.avatar)
            user.avatar = null
            await user.save()
            return res.json(user)
        } catch (e) {
            next(e)
        }
    }

}


module.exports = new userController()