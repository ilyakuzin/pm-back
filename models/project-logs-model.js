const {Schema, model} = require('mongoose')

const ProjectLogSchema = new Schema({
        projectId: {type: Schema.Types.ObjectId, ref: 'Project', required: true},
        changedByManager: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        dateOfChange: {type: Date, default: Date.now()},
        manager_actual: {type: Schema.Types.ObjectId, ref: 'User'},
        manager_late: {type: Schema.Types.ObjectId, ref: 'User'},
        developers_actual: [{type: Schema.Types.ObjectId, ref: 'User'}],
        developers_late: [{type: Schema.Types.ObjectId, ref: 'User'}],
        designers_actual: [{type: Schema.Types.ObjectId, ref: 'User'}],
        designers_late: [{type: Schema.Types.ObjectId, ref: 'User'}],
        status_actual: {type: Schema.Types.ObjectId, ref: 'Status'},
        status_late: {type: Schema.Types.ObjectId, ref: 'Status'},
        relatedProjects_actual: [{type: Schema.Types.ObjectId, ref: 'Project'}],
        relatedProjects_late: [{type: Schema.Types.ObjectId, ref: 'Project'}],
        actual: {
                name: {type: String},
                deadline: {type: Date}, //cрок по договору
                comments: [{type: String}],
                evaluationOfProject: {type: Number}, //оценка проекта (часы)
                wastedHours: {type: Number}, //потраченные часы
                evaluationByHour: {type: Number}, //стоимость в час (ставка)
                percentageDifference: {type: Number}, //(оценка проекта-потр часы)/оценка проекта
                profit: {type: Number}, //ставка1час * стоимость проекта - ставка разработчика * потр часы
                cost: {type: Number}, //ставка * оценка
        },
        late: {
                name: {type: String},
                deadline: {type: Date}, //cрок по договору
                comments: [{type: String}],
                evaluationOfProject: {type: Number}, //оценка проекта (часы)
                wastedHours: {type: Number}, //потраченные часы
                evaluationByHour: {type: Number}, //стоимость в час (ставка)
                percentageDifference: {type: Number}, //(оценка проекта-потр часы)/оценка проекта
                profit: {type: Number}, //ставка1час * стоимость проекта - ставка разработчика * потр часы
                cost: {type: Number}, //ставка * оценка
        }
    },
)

module.exports = model('ProjectLog', ProjectLogSchema)