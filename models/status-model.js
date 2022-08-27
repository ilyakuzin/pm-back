const {Schema, model} = require('mongoose')
const STATUSES = {
    NEGOTIATION: 'Переговоры',
    DESIGN_DRAWING: 'Отрисовка дизайна',
    DESIGN_STATEMENT: 'Утверждение дизайна',
    PROGRAMMING_START: 'Старт программирования',
    BURN: 'Горит',
    OS_WAITING: 'Ждем ОС клиента',
    INSTRUCTIONS_WRITING: 'Пишем инструкцию',
    TESTING: 'Внутрненне тестирование',
    EDIT: 'Вносим правки',
    ADVERTISING: 'Реклама',
    TECHNICAL_SUPPORT: 'Техподдержка',
    CLOSED: 'Закрыт',
    SEND_FOR_DEVELOPMENT: 'Отдать в разработку',
    EXTRA_SALE_SUGGESTING: 'Предложить доп. продажу',
    WAITING_FOR_PAYMENT: 'Ждем оплату',
    PROJECT_DISCUSS: 'Обсудить проект',
    SUSPENDED: 'Приостановлен'
}

const StatusSchema = new Schema({
    statusName: {
        type: String,
        enum: Object.values(STATUSES),
        default: STATUSES.NEGOTIATION,
        unique: true
    },
    emoji: {type: String},
    colour: {type: String}
})

module.exports = model('Status', StatusSchema)

