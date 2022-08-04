const authService = require("../service/auth-service");
const {validationResult} = require('express-validator')
const User = require('../models/user-model.js')
const apiError = require("../exceptions/api_errors");

class authController {
// @desc     Auth user
// @route    POST /api/auth/login
// @access   Public
    async login(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                next(apiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {email, password} = req.body
            const userData = await authService.login(email, password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

// @desc     Logout user
// @route    POST /api/users/logout
// @access   Private
    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const token = await authService.logout(refreshToken)
            res.clearCookie()
            return res.json(token)
        } catch (e) {
            next(e)
        }
    }

// @desc     Refresh access token
// @route    Get /api/users/refresh
// @access   Private
    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const userData = await authService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)

        } catch (e) {
            next(e)
        }
    }
}

module.exports = new authController()