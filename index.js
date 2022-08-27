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
const paysheetRouter = require('./router/paysheet-router')
const fileUpload = require('express-fileupload')
const filepathMiddleware = require('./middleware/filepath-middleware')
const path = require('path')
const errorMiddleware = require('./middleware/error-middleware')
const TelegramApi = require('node-telegram-bot-api')
const cron = require('node-cron')
const botService = require('./service/bot-service')

/* Config */
const PORT = process.env.PORT || 5000
const DB_URL = process.env.DB_URL
const TOKEN = process.env.TOKEN
const CHAT_ID = process.env.CHAT_ID

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
app.use('/api/paysheet', paysheetRouter)

app.use(errorMiddleware)
/* Starting server and connecting to DB*/
const start = async () => {
    try {
        await mongoose.connect(DB_URL)
        app.listen(PORT, () => console.log(`server started on ${PORT} port `))
        const bot = new TelegramApi(TOKEN, {polling: true})
        const msg = await botService.getStats()
        cron.schedule('00 43 3 * * 2-6', () => { //'00 43 3 * * 2-6' */45 * * * * *
            bot.sendMessage(CHAT_ID, msg) //msg
        })
    } catch (e) {
        console.log(e)
    }
}

start()