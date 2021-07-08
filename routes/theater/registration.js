const crypto = require("crypto");
const emailEngine = require('../email.js')
const mailTemplates = require('../email/mailTemplates.js')
const logger = require('./logger.js')

const { listing_sccret } = require('./secrets.json')


module.exports = (app, db) => {

    // Registers account
    app.post('/api/protected/theater/registration', async (req, res) => {
        const { name, surname, email, telephone, people_count, event_id, address } = req.body

        console.log(req.body)

        if (!people_count || !Number(people_count)) return res.status(400).json({ error: "Personenanzahl nicht angeben" })
        if (people_count < 1 || people_count > 8) return res(403).json({ error: "Unzulässige Personenanzahl" })

        if (!name) return res.status(400).json({ error: "Vorname nicht angeben" })
        if (!surname) return res.status(400).json({ error: "Nachname nicht angeben" })

        if (!email) return res.status(400).json({ error: "E-Mail Addresse nicht angeben" })

        if (!event_id) return res.status(400).json({ error: "Keine Veranstaltung ausgewählt" })
        if (!address) return res.status(400).json({ error: "Keine Addresse angegeben" })

        try {
            const registered = await db('registration').where('surname', surname).where('name', name).select('name')
            if (registered.length > 0) return res.status(400).json({ error: 'Bereits registriert' })

            const eventSlots = await db('event').where('id', event_id).select('free_slots', 'date')
            if (eventSlots.length == 0) return res.status(400).json({ error: 'Unzulässige Aufführung' })
            if (eventSlots[0].free_slots < people_count) return res.status(400).json({ error: 'Nicht genug freie Plätze vorhanden' })

            // Secret
            const token = crypto.randomBytes(8).toString("hex")

            await db('registration').insert({
                name,
                surname,
                email,
                telephone,
                people_count,
                address,
                event_id,
                token,
                registered_timestamp: Date.now()
            })

            await db('event').where('id', event_id).update({ free_slots: eventSlots[0].free_slots - people_count })

            emailEngine.sendMail(email,
                mailTemplates.registrationSuccessful({
                    name,
                    surname,
                    people_count,
                    date: eventSlots[0].date,
                    token
                })
            )

            logger({
                event: "registered",
                people_count: people_count,
            })

            console.log('register', token)

            return res.status(200).json({ success: 'Erfolgreich angemeldet', token })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error, text: "Fehler beim Anmelden" })
        }
    })

    // Removes a registration
    app.get('/api/public/theater/registration/delete/:token', async (req, res) => {
        const token = req.params.token
        try {
            if (!token) return res.status(400).json({ error: "Token fehlt" })
            const registration = await db('registration').select('event_id', 'people_count', 'surname', 'name', 'email').where('token', token)
            if (registration.length == 0) return res.status(404).json({ error: "Keine Anmeldung gefunden" })
            const event_id = registration[0].event_id
            const event = await db('event').where('id', event_id).select('free_slots', 'date')
            if (event.length == 0) return res.status(404).json({ error: "Keine Event gefunden" })

            const checkedIn = await db('checkin').where('token', token).select('id')
            if (checkedIn.length > 0) return res.status(404).json({ error: "Bereits eingecheckt! Stornierung nicht möglich!" })

            await db('event').where('id', event_id).update({ free_slots: event[0].free_slots + registration[0].people_count })
            await db('registration').where('token', token).del()

            const { name, surname, people_count, email } = registration[0]

            emailEngine.sendMail(email,
                mailTemplates.unregistrationSuccessful({
                    name,
                    surname,
                    people_count,
                    date: event[0].date,
                })
            )
            logger({
                event: "storno",
                people_count: people_count,
            })

            console.log('storno', token)

            res.status(200).send("<h1>Anmeldung erfolgreich storniert</h1>")
        } catch (error) {
            console.error(error)
            res.status(500).json({ error, text: "Fehler beim Stornieren" })
        }
    })

    app.post('/api/public/theater/registration/listing', async (req, res) => {
        const { secret } = req.body
        if (secret != listing_sccret) return res.status(403).json({ error: "Unautorisiert!" })
        const events = await db('event').select('*')
        let output = []
        for (let i = 0; events.length; i++) {
            const event = events[i]
            const registration = db('registration').where('event_id', event.id).select('name', 'surname', 'people_count')

            output.push({
                registration,
                eventname: event.name,
                eventdate: event.date
            })
        }

        res.status(200).json(output)
    })
}