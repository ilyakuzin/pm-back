const hoursService = require('../service/hours-service')
const apiError = require("../exceptions/api_errors")
const {validationResult} = require('express-validator')

class HoursController {

// @desc     Add hours
// @route    POST /api/hours/add
// @access   Private
    async addHours(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                next(apiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {projectName, quantity, date, description} = req.body
            const userId = req.user.id
            const hoursData = await hoursService.addHours(userId, projectName, quantity, date, description)
            res.json(hoursData)
        } catch (e) {
            next(e)
        }
    }

// @desc     Get hours
// @route    GET /api/hours/my
// @access   Private
    async getHours(req, res, next) {
        try {
            const start = req.query.start
            const end = req.query.end
            const userId = req.user.id
            const hoursData = await hoursService.getHours(userId, start, end)
            res.json(hoursData)
        } catch (e) {
            next(e)
        }
    }

// @desc     Get all hours
// @route    GET /api/hours/
// @access   Private
    async getAllHours(req, res, next) {
        try {
            const start = req.query.start
            const end = req.query.end
            const hoursData = await hoursService.getAllHours( start, end)
            res.json(hoursData)
        } catch (e) {
            next(e)
        }
    }

// @desc     Update hours
// @route    PUT /api/hours/update/:id
// @access   Private
    async updateHours(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                next(apiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {quantity, description} = req.body
            const hoursData = await hoursService.updateHours(req.params.id, quantity, description)
            res.json(hoursData)
        } catch (e) {
            next(e)
        }
    }

// @desc     Delete hours
// @route    DELETE /api/hours/delete/:id
// @access   Private
    async deleteHours(req, res, next) {
        try {
            const id = req.params.id
            await hoursService.deleteHours(id)
            res.json({message: 'Часы удалены'})
        } catch (e) {
            next(e)
        }
    }
}


module.exports = new HoursController()
