function cors(req, res, next){
    res.header("Access-Control-Allow-Origin", "http://localhost:3000")
    // res.header("Access-Control-Allow-Origin", "https://senseimanagement.netlify.app")
    res.header("Access-Control-Allow-Credentials", true)
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE")
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization")
    next()
}

module.exports = cors