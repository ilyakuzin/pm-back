const {Schema, model} = require('mongoose')

const HoursSchema = new Schema({
        userId: [{type: Schema.Types.ObjectId, ref: 'User'}],
        projectId: [{type: Schema.Types.ObjectId, ref: 'Project'}],
        quantity: {type: Number},
        date: {type: Date, default: Date.now()}
    },
    {
        minimize: false,
        timestamps: true,
    })

module.exports = model('Hours', HoursSchema)
