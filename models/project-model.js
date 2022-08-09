const {Schema, model} = require('mongoose')

const ProjectSchema = new Schema({
        name: {type: String, unique: true, required: true},
        manager: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        developers: [{type: Schema.Types.ObjectId, ref: 'User', required: true}],
        designers: [{type: Schema.Types.ObjectId, ref: 'User', required: true}],
        deadline: {type: Date}, //cрок по договору
        comments: [{type: String}],
        evaluationOfProject: {type: Number, required: true}, //оценка проекта (часы)
        wastedHours: {type: Number, default: 0}, //потраченные часы
        evaluationByHour: {type: Number, required: true}, //стоимость в час (ставка)
        percentageDifference: {type: Number}, //(оценка проекта-потр часы)/оценка проекта
        profit: {type: Number}, //ставка1час * стоимость проекта - ставка разработчика * потр часы
        cost: {type: Number, default: 0}, //ставка * оценка
        status: {type: Schema.Types.ObjectId, ref: 'Status', required: true},
        relatedProjects: [{type: Schema.Types.ObjectId, ref: 'Project'}]
    },
    {
        timestamps: true
    }
)


module.exports = model('Project', ProjectSchema)