const {Schema, model} = require('mongoose')

const RateSchema = new Schema({
        value: {type: Number, required: true},
        date: {type: Date, required: true},
        userId: {type: Schema.Types.ObjectId, ref: 'User'}
    },
    {
        minimize: false,
        timestamps: true,
    })

module.exports = model('User-rate', RateSchema)