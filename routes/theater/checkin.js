const { checkIn_secret } = require('./secrets.json')
const path = require('path');

module.exports = (app, db) => {
    app.post('/api/public/theater/checkin', async (req, res) => {
        const { token, checkIn } = req.body
        if (checkIn != checkIn_secret) return res.status(403).json({ error: "Falscher Key" })
        if (!token) return res.status(403).json({ error: "Kein Token" })
        const registration = await db('registration').where('token', token).leftJoin('event', 'event.id', 'registration.event_id').select('registration.name', 'registration.surname', 'registration.people_count', 'event.date', 'event.name as eventname')
        if (registration.legth == 0) return res.status(404).json({ error: "Registrierung nicht gefunden!" })

        const checkedIn = await db('checkin').where('token', token).select('date')
        if (checkedIn.length > 0) return res.status(400).json({ error: "Bereits eingecheckt (" + new Date(checkedIn[0].date).toLocaleString() + ")" })

        await db('checkin').insert({ token, date: Date.now() })
        console.log('checkIn', token)

        return res.status(200).json(registration[0])
    })
}