const Hours = require('../models/hours-model')
const Project = require('../models/project-model')
const apiError = require('../exceptions/api_errors')

class HoursService {
    async addHours(userId, projectName, quantity, date) {
        const project = await Project.findOne({projectName})
        if (!project) {
            throw apiError.BadRequest('Проект с данным именем не найден')
        }
        const hours = await Hours.create({userId, projectId: project._id, quantity, date})
        return hours
    }

    async getHours(userId) {
        const hours = await Hours.find({userId})
        return hours
    }

    async updateHours(id, quantity, date) {
        const hours = await Hours.findById(id)
        if (!hours) {
            throw apiError.BadRequest('Часы не найдены')
        }
        if (quantity) {
            hours.quantity = quantity
        }
        if (date) {
            hours.date = date
        }
        const updatedHours = hours.save()
        return updatedHours
    }

    async deleteHours(id) {
        const hours = await Hours.findByIdAndDelete(id)
        if (!hours) {
            throw apiError.BadRequest('Часы не найдены')
        }
    }

}

module.exports = new HoursService()