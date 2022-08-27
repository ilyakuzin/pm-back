const hoursService = require('../service/hours-service')

class BotService {

    async getStats() {
        const end = new Date(Date.now()).toISOString()
        const start = new Date(Date.now() - 86400000).toISOString()
        let data = await hoursService.getAllHours(start, end)
        const dataHours = data.hoursData
        data = JSON.stringify(data)
        let msg = ''
        let userHours = ''
        let ctr = 1
        console.log(data)

        dataHours.map(user => {
            let userSum = 0;

            user.projectData.map(project => {
                let projectSum = 0;
                userHours = ''
                project.hours.map((hour => {
                    projectSum += hour.quantity
                    userHours += `* ${project.name} --- ${hour.quantity} ч.\n`
                }));
                project.sum = projectSum;
                userSum += projectSum;
                msg += project.project.name + ' ' + project.sum + 'ч' + '\n'
            })
            user.sum = userSum;
            user.user.name = (user.user.surname ? (user.user.surname + ' ') : '') + (user.user.firstName ? (user.user.firstName) : '');
            if (userSum === 0) {
                msg = `${ctr}. ${user.user.name}  не заполнил часы\n`
            } else {
                msg += `${ctr}. ${user.user.name} отработал ${userSum} ч.\n`
            }
            ctr++
        })
        return msg
    }

}

module.exports = new BotService()