const Hours = require('../models/hours-model')
const Project = require('../models/project-model')
const User = require('../models/user-model')
const apiError = require('../exceptions/api_errors')
const UserRate = require('../models/userRate-model')

class HoursService {
    async addHours(userId, projectName, quantity, date, description) {
        const project = await Project.findOne({name: projectName, developers: userId})
        const rate = await UserRate.findOne({userId: userId})
        if (!project) {
            throw apiError.BadRequest('Проект с данным именем не найден среди ваших проектов')
        }
        const candidateHours = await Hours.find({projectId: project.id, date})
        console.log(candidateHours)
        if(candidateHours.length != 0){
            throw apiError.BadRequest('В данный день, на данном проекте уже добавлены часы')
        }

        project.wastedHours += quantity
        project.profit = project.cost - rate.value * quantity
        //тут должен быть сбор статистики для бота
        await project.save()
        const hours = await Hours.create({userId, projectId: project._id, quantity, date, description})
        return hours
    }

    async getHours(userId, start, end) {
        if (start && end) {
            const hours = await Hours.find({userId, date: {$gte: start, $lt: end}}).populate('projectId', 'name')
            return hours
        }
        const hours = await Hours.find({userId}).populate('projectId', 'name')
        return hours

    }

    async getAllHours(start, end) {
        const users = await User.find({roles: 'DEVELOPER'}).select('firstName secondName surname avatar')
        let hoursData = []
        for (const user of users) {
            const projects = await Project.find({developers: user.id}).select('name')
            let projectData = []
            for (const project of projects) {
                if (start && end) {
                    const hours = await Hours.find({
                        userId: user.id,
                        projectId: project.id,
                        date: {$gte: start, $lt: end}
                    }).select('quantity date description')
                    projectData.push({project, hours})
                } else {
                    const hours = await Hours.find({
                        userId: user.id,
                        projectId: project.id,
                    }).select('projectId, quantity date description')
                    projectData.push({project, hours})
                }
            }
            hoursData.push({user, projectData})
        }
        return {hoursData}
    }

    async updateHours(id, quantity, description) {
        const hours = await Hours.findById(id)
        if (!hours) {
            throw apiError.BadRequest('Часы не найдены')
        }
        if (quantity) {
            hours.quantity = quantity
        }
        if (description) {
            hours.description = description
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