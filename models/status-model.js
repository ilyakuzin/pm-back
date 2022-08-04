const {Schema, model} = require('mongoose')

const StatusSchema = new Schema({
    statusName: {type: String, required: true},
    statusColour: {type: String, required: true}
})