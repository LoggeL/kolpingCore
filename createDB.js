const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './data.sqlite',
    },
});

(async () => {

    const registrationsExists = await knex.schema.hasTable('registration')
    console.log('registrationsExists', registrationsExists)

    if (!registrationsExists) {
        await knex.schema.createTable('registration', table => {
            table.increments('id').primary()
            table.string('name')
            table.string('surname')
            table.string('email')
            table.string('address')
            table.string('telephone')
            table.int('people_count')
            table.int('event_id')
            table.bool('vaccinated')
            table.string('token')
            table.timestamp('registered_timestamp')
        })
    }

    const eventsExists = await knex.schema.hasTable('event')
    console.log('eventsExists', eventsExists)

    if (!eventsExists) {
        await knex.schema.createTable('event', table => {
            table.increments('id').primary()
            table.string('name')
            table.date('date')
            table.int('max_slots')
            table.int('free_unvaccinated')
            table.int('free_slots')
        })

        await knex('event').insert([{
            name: "Kolping-Oktoberfest",
            date: 1635062400000,
            max_slots: 150,
            free_slots: 150,
            free_unvaccinated: 20
        }])
    }

    const checkinExists = await knex.schema.hasTable('checkin')
    console.log('checkinExists', eventsExists)

    if (!checkinExists) {
        await knex.schema.createTable('checkin', table => {
            table.increments('id').primary()
            table.string('token')
            table.timestamp('date')
        })
    }

    knex.destroy()
})()