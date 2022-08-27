const {Schema, model} = require('mongoose')

const UserSchema = new Schema({
        firstName: {type: String, required: true},
        secondName: {type: String},
        surname: {type: String},
        email: {type: String, unique: true, required: true},
        password: {type: String},
        phone: {type: Number, unique: true, required: true},
        tgLogin: {type: String, unique: true, required: true},
        roles: [{type: String, ref: 'Role'}],
        avatar: {type: String},
        isActivated: {type: Boolean, default: false},
        activationLink: String,
        activationExpires: Date,
    },
    {
        minimize: false,
        timestamps: true,
    })

module.exports = model('User', UserSchema)