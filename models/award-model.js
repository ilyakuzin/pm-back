const {Schema, model} = require('mongoose')

const AwardSchema = new Schema({
        userId: {type: Schema.Types.ObjectId, ref: 'User'},
        award: {type: Number, default: 0},
        date: {type: Date, default: Date.now()}
    },
    {
        minimize: false,
        timestamps: true,
    })

module.exports = model('Award', AwardSchema)