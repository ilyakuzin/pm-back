const apiError = require('../exceptions/api_errors')
const tokenService = require('../service/token-service')

module.exports = function (roles) {
    return function (req, res, next) {
        try {
            const authorizationHeader = req.headers.authorization
            if (!authorizationHeader) {
                return next(apiError.UnauthorizedError())
            }
            const accessToken = authorizationHeader.split(' ')[1]
            if (!accessToken) {
                return next(apiError.ForbiddenError())
            }
            const {roles: userRoles} = tokenService.validateAccessToken(accessToken)
            let hasRole = false
            userRoles.forEach(role => {
                if (roles.includes(role)) {
                    hasRole = true
                }
            })

            if (!hasRole) {
                throw apiError.ForbiddenError()
            }
            next()

        } catch (e) {
            return next(apiError.ForbiddenError())
        }
    }
}


