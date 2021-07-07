module.exports = (app, db) => {
    require('./theater/registration.js')(app, db)
    require('./theater/event.js')(app, db)
    require('./theater/ticket.js')(app, db)
}