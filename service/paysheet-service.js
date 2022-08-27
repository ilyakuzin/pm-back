const UserRate = require('../models/userRate-model')
const apiError = require('../exceptions/api_errors')
const User = require('../models/user-model')
const Prepayment = require('../models/prepayment-model')
const Vacation = require('../models/vacation-model')
const Award = require('../models/award-model')
const HoursService = require('../service/hours-service')


class PaysheetService {
    async addUserRate(value, date, userId) {
        const userRate = (await UserRate.create({
            value,
            date,
            userId
        })).populate('userId', 'firstName secondName surname')
        return userRate
    }

    async addPrepaymentVacationAward(userId, prepayment, vacation, award, date) {
        let prepaymentData, vacationData, awardData
        if (prepayment) {
            prepaymentData = await Prepayment.create({userId, prepayment, date})
        }
        if (vacation) {
            vacationData = await Vacation.create({userId, vacation, date})
        }
        if (award) {
            awardData = await Award.create({userId, award, date})
        }
        return {
            userId,
            prepayment: (!prepaymentData) ? 0 : prepaymentData.prepayment,
            vacation: (!vacationData) ? 0 : vacationData.vacation,
            award: (!awardData) ? 0 : awardData.award,
            date
        }
    }

    async updatePrepayment(id, prepayment, date) {
        const prepaymentData = await Prepayment.findById(id)
        if (!prepaymentData) {
            throw apiError.BadRequest('Аванс не найден')
        }
        if (prepayment) {
            prepaymentData.prepayment = prepayment
        }
        if (date) {
            prepaymentData.date = date
        }
        const updatedPrepayment = prepaymentData.save()
        return updatedPrepayment
    }

    async updateVacation(id, vacation, date) {
        const vacationData = await Vacation.findById(id)
        if (!vacationData) {
            throw apiError.BadRequest('Аванс не найден')
        }
        if (vacation) {
            vacationData.vacation = vacation
        }
        if (date) {
            vacationData.date = date
        }
        const updatedVacation = vacationData.save()
        return updatedVacation
    }

    async updateAward(id, award, date) {
        const awardData = await Award.findById(id)
        if (!awardData) {
            throw apiError.BadRequest('Аванс не найден')
        }
        if (award) {
            awardData.award = award
        }
        if (date) {
            awardData.date = date
        }
        const updatedAward = awardData.save()
        return updatedAward
    }

    async calculateSalary(userId, rate, start, end) {
        const hours = await HoursService.getHours(userId, start, end) // получаем часы за период
        let allHoursForPeriod = 0
        hours.forEach(element => {
            allHoursForPeriod += element.quantity
        })
        const salary = allHoursForPeriod * rate // сумма всех часов на ставку
        return {salary, hours: allHoursForPeriod}
    }

    async getUserSalary(userId, start, end) {
        let salary = 0, hours = 0, rateValue
        let rates = await UserRate.find({ // поиск ставки в выбранном периоде
            userId,
            date: {$gte: start, $lte: end}
        }).sort({date: -1}).select('value date')
        // rateValue = rates[0].value
        if (rates.length === 0) {
            // если за выбранный период ставка не найдена, то ищем самую последнюю, которая раньше старта
            const rate = await UserRate.findOne({
                userId,
                date: {$lte: start}
            }).sort({date: -1}).select('value date')

            if (!rate) {
                throw apiError.BadRequest('В этот период ставок еще не было')
            }
            rateValue = rate
            const paysheet = await this.calculateSalary(userId, rate.value, start, end)
            salary += paysheet.salary
            hours += paysheet.hours
        } else {
            rateValue = rates
            const temp = start
            for (const rate of rates) {
                start = rate.date
                if (start === end) {
                    start = temp
                }
                const paysheet = await this.calculateSalary(userId, rate.value, start, end)
                salary += paysheet.salary
                hours += paysheet.hours
                end = rate.date
            }
        }
        return {rate: rateValue, salary, hours}
    }

    async getPrepaymentVacationAward(userId, start, end) {
        const prepayment = await Prepayment.findOne({userId, date: {$gte: start, $lte: end}}).select('prepayment')
        const vacation = await Vacation.findOne({userId, date: {$gte: start, $lte: end}}).select('vacation')
        const award = await Award.findOne({userId, date: {$gte: start, $lte: end}}).select('award')
        return {
            prepayment: (!prepayment) ? 0 : prepayment,
            vacation: (!vacation) ? 0 : vacation,
            award: (!award) ? 0 : award,
        }
    }

    async getPaysheet(start, end) {
        const users = await User.find({roles: 'DEVELOPER'}).select('firstName secondName surname avatar')
        let updatedUsers = []
        for (const user of users) {
            const salary = await this.getUserSalary(user.id, start, end)
            const paysheet = await this.getPrepaymentVacationAward(user.id, start, end)
            updatedUsers.push({
                user, rate: salary.rate, hours: salary.hours, salary: salary.salary, prepayment: paysheet.prepayment,
                vacation: paysheet.vacation, award: paysheet.award
            })
        }
        return {users: updatedUsers}
    }

    async deletePrepayment(id) {
        const prepayment = await Prepayment.findByIdAndDelete(id)
        if (!prepayment) {
            throw apiError.BadRequest('Аванс не найден')
        }
    }

    async deleteVacation(id) {
        const vacation = await Vacation.findByIdAndDelete(id)
        if (!vacation) {
            throw apiError.BadRequest('Отпускные не найдены')
        }
    }

    async deleteAward(id) {
        const award = await Award.findByIdAndDelete(id)
        if (!award) {
            throw apiError.BadRequest('Премия не найдена')
        }
    }

}

module.exports = new PaysheetService()