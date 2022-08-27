const paysheetService = require('../service/paysheet-service');

class PaysheetController {

// @desc     Post user rate
// @route    POST /api/paysheet/rate/add
// @access   Private
    async addUserRate(req, res, next) {
        try {
            const {value, date, userId} = req.body
            const userRateData = await paysheetService.addUserRate(value, date, userId)
            res.json(userRateData)
        } catch (e) {
            next(e)
        }
    }

// @desc     Post prepayment, vacation, award
// @route    POST /api/paysheet/
// @access   Private
    async addPrepaymentVacationAward(req, res, next) {
        try {
            const {userId, prepayment, vacation, award, date} = req.body
            const data = await paysheetService.addPrepaymentVacationAward(userId, prepayment, vacation, award, date)
            res.json(data)
        } catch (e) {
            next(e)
        }
    }

// @desc     Update prepayment
// @route    PUT /api/paysheet/prepayments/:id
// @access   Private
    async updatePrepayment(req, res, next) {
        try {
            const id = req.params.id
            const {prepayment, date} = req.body
            const prepaymentData = await paysheetService.updatePrepayment(id, prepayment, date)
            res.json(prepaymentData)
        } catch (e) {
            next(e)
        }
    }

// @desc     Update vacation
// @route    PUT /api/paysheet/vacations/:id
// @access   Private
    async updateVacation(req, res, next) {
        try {
            const id = req.params.id
            const {vacation, date} = req.body
            const vacationData = await paysheetService.updateVacation(id, vacation, date)
            res.json(vacationData)
        } catch (e) {
            next(e)
        }
    }

// @desc     Update award
// @route    PUT /api/paysheet/awards/:id
// @access   Private
    async updateAward(req, res, next) {
        try {
            const id = req.params.id
            const {award, date} = req.body
            const awardData = await paysheetService.updateAward(id, award, date)
            res.json(awardData)
        } catch (e) {
            next(e)
        }
    }

// @desc     Delete prepayment
// @route    DELETE /api/paysheet/prepayments/:id
// @access   Private
    async deletePrepayment(req, res, next) {
        try {
            const id = req.params.id
            await paysheetService.deletePrepayment(id)
            res.json({message: 'Аванс удален'})
        } catch (e) {
            next(e)
        }
    }

// @desc     Delete vacation
// @route    DELETE /api/paysheet/vacations/:id
// @access   Private
    async deleteVacation(req, res, next) {
        try {
            const id = req.params.id
            await paysheetService.deleteVacation(id)
            res.json({message: 'Отпускные удален'})
        } catch (e) {
            next(e)
        }
    }

// @desc     Delete award
// @route    DELETE /api/paysheet/awards/:id
// @access   Private
    async deleteAward(req, res, next) {
        try {
            const id = req.params.id
            await paysheetService.deleteAward(id)
            res.json({message: 'Премия удалена'})
        } catch (e) {
            next(e)
        }
    }

// @desc     Get paysheet
// @route    GET /api/paysheet/
// @access   Private
    async getPaysheet(req, res, next) {
        try {
            const start = req.query.start
            const end = req.query.end
            const paysheetData = await paysheetService.getPaysheet(start, end)
            res.json(paysheetData)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new PaysheetController()