const hoursService = require('../service/hours-service')
const apiError = require("../exceptions/api_errors");

class HoursController {

// @desc     Add hours
// @route    POST /api/hours/add
// @access   Private
    async addHours(req, res, next) {
        try {
            const {projectName, quantity, date} = req.body
            const userId = req.user.id
            const hoursData = await hoursService.addHours(userId, projectName, quantity, date)
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
            const userId = req.user.id
            const hoursData = await hoursService.getHours(userId)
            res.json(hoursData)
        } catch (e) {
            next(e)
        }
    }

// @desc     Update hours
// @route    PUT /api/hours/:id
// @access   Private
    async updateHours(req, res, next) {
        try {
            const {quantity, date} = req.body
            const hoursData = await hoursService.updateHours(req.params.id, quantity, date)
            res.json(hoursData)
        } catch (e) {
            next(e)
        }
    }

// @desc     Delete hours
// @route    DELETE /api/hours/:id
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