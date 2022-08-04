const {Schema, model} = require('mongoose')

const ProjectSchema = new Schema({
        name: {type: String, unique: true, required: true},
        managerID: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        workers: [{type: Schema.Types.ObjectId, ref: 'User', required: true}], //разработчики и дизайнеры
        //devs: [{type: Schema.Types.ObjectId, ref: 'User', required: true}],
        //designer: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        contract: {type: Date}, //cрок по договору
        comments: [{type: String}],
        contractEvaluation: {type: Number, required: true}, //оценка проекта (часы)
        hoursSpent: {type: Number, default: 0}, //потраченные часы
        estimationInHour: {type: Number, required: true}, //стоимость в час (ставка)
        cost: {type: Number, default: 0}, //ставка*потраченные часы
        statusID: {type: String, ref: 'Status'},
        relatedProjects: [{type: Schema.Types.ObjectId, ref: 'Project'}] //связанные проекты
    },
    {
        timestamps: true
    }
)



module.exports = model('Project', ProjectSchema)