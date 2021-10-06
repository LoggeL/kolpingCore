const fs = require('fs')
const fns = require('date-fns')
const QRCode = require('qrcode')

const QR_SVG = fs.readFileSync('routes/theater/ticket.svg', 'utf-8')
const QR_SVG_checkin = fs.readFileSync('routes/theater/ticket_checkin.svg', 'utf-8')

module.exports = async (app, db) => {
    app.get('/api/public/theater/ticket/:token', async (req, res) => {
        const token = req.params.token
        if (!token) res.status(400).json({ error: "Kein Token angegeben" })

        const qr_data = await db('registration').where('token', token).leftJoin('event', 'event.id', 'registration.event_id').select('date', 'people_count')
        if (qr_data.length == 0) return res.status(404).json({ error: "Anmeldung nicht gefunden" })

        const checkin_data = await db('checkin').where('token', token).select('date')

        const RQ_URL = await QRCode.toDataURL("http://theater.kolping-ramsen.de/ticket.html?" + token, { margin: 0 })

        const QR_SVG_EDIT = (checkin_data[0] ? QR_SVG_checkin : QR_SVG)
            .replace('{{PERSON}}', qr_data[0].people_count == 1 ? 'PERSON' : 'PERSONEN')
            .replace('{{PERSON_X}}', qr_data[0].people_count == 1 ? '-20' : '-50')
            .replace('{{PEOPLE_COUNT}}', qr_data[0].people_count)
            .replace('{{DATE}}', fns.format(new Date(qr_data[0].date), 'dd/MM/yyyy | HH:mm'))
            .replace('{{TOKEN}}', token)
            .replace('{{QR_URL}}', RQ_URL)
            .replace('{{EINGECHECKT}}', checkin_data[0] ? 'Eingecheckt' : '')
            .replace('{{EINGECHECKT_DATE}}', checkin_data[0] ? fns.format(new Date(checkin_data[0].date), 'dd/MM/yyyy HH:mm') : '')


        res.setHeader('content-type', 'image/svg+xml')
        return res.status(200).send(QR_SVG_EDIT)
    })
}