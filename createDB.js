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
            table.int('free_slots')
        })

        await knex('event').insert([{
            name: "Premiere Malleus Maleficarum",
            date: 1630087200000,
            max_slots: 120,
            free_slots: 120
        }, {
            name: "2. Aufführung Malleus Maleficarum",
            date: 1630256400000,
            max_slots: 120,
            free_slots: 120
        }, {
            name: "3. Aufführung Malleus Maleficarum",
            date: 1630692000000,
            max_slots: 120,
            free_slots: 120
        }, {
            name: "4. Aufführung Malleus Maleficarum",
            date: 1630861200000,
            max_slots: 120,
            free_slots: 120
        }])
    }

    const eventsExists = await knex.schema.hasTable('event')
    console.log('eventsExists', eventsExists)

    if (!eventsExists) {
        await knex.schema.createTable('checkin', table => {
            table.increments('id').primary()
            table.string('token')
            table.timestamp('date')
        })
    }

    knex.destroy()
})()