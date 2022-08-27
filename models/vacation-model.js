const {Schema, model} = require('mongoose')

const VacationSchema = new Schema({
        userId: {type: Schema.Types.ObjectId, ref: 'User'},
        vacation: {type: Number, default: 0},
        date: {type: Date, default: Date.now()}
    },
    {
        minimize: false,
        timestamps: true,
    })

module.exports = model('Vacation', VacationSchema)