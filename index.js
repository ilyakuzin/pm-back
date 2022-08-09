require('dotenv').config()
const express = require('express')
// const cors = require('cors')
const corsMiddleware = require('./middleware/cors-middleware')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const auth = require('./router/auth-router')
const userRouter = require('./router/user-router')
const projectRouter = require('./router/project-router')
const hoursRouter = require('./router/hours-router')
const fileUpload = require('express-fileupload')
const filepathMiddleware = require('./middleware/filepath-middleware')
const path = require('path')

/* Config */
const PORT = process.env.PORT || 5000
const DB_URL = process.env.DB_URL

const app = express()

/* Middleware*/
app.use(fileUpload({}))
app.use(corsMiddleware)
app.use(filepathMiddleware(path.resolve(__dirname, 'static')))
app.use(express.json())
app.use(cookieParser())

app.use(express.static('static'))

/* Routes */
app.use('/api/auth', auth)
app.use('/api/users', userRouter)
app.use('/api/projects', projectRouter)
app.use('/api/hours', hoursRouter)

/* Starting server and connecting to DB*/
const start = async () => {
    try {
        await mongoose.connect(DB_URL)
        app.listen(PORT, () => console.log(`server started on ${PORT} port `))

    } catch (e) {
        console.log(e)
    }
}

start()