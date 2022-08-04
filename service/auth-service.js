const User = require('../models/user-model.js')
const tokenService = require('./token-service')
const apiError = require('../exceptions/api_errors')
const bcrypt = require('bcrypt')
const UserDto = require('../dtos/user-dtos')

class authService {

    async login(email, password){
        const user = await User.findOne({email})
        if(!user){
            throw apiError.BadRequest(`Пользователь  ${email} не найден`)
        }
        const isPassEquals = await bcrypt.compare(password, user.password)
        if(!isPassEquals){
            throw apiError.BadRequest('Введен неверный пароль')
        }
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }

    async logout(refreshToken){
        const token = await tokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken){
        if(!refreshToken){
            throw apiError.UnauthorizedError()
        }
        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDB = await tokenService.findToken((refreshToken))
        if(!userData || !tokenFromDB){
            throw apiError.UnauthorizedError()
        }
        const user = await User.findById(userData.id)
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }
}
module.exports = new authService()