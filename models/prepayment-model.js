const {Schema, model} = require('mongoose')

const PrepaymentSchema = new Schema({
        userId: {type: Schema.Types.ObjectId, ref: 'User'},
        prepayment: {type: Number, default: 0},
        date: {type: Date, default: Date.now()}
    },
    {
        minimize: false,
        timestamps: true,
    })

module.exports = model('Prepayment', PrepaymentSchema)