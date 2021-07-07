const fs = require('fs')
const fns = require('date-fns')
const QRCode = require('qrcode')
const { convert } = require('convert-svg-to-png');

const QR_SVG = fs.readFileSync('routes/theater/ticket.svg', 'utf-8')

module.exports = async (app, db) => {
    app.get('/api/public/theater/ticket/:token', async (req, res) => {
        const token = req.params.token
        if (!token) res.status(400).json({ error: "Kein Token angegeben" })

        const qr_data = await db('registration').where('token', token).leftJoin('event', 'event.id', 'registration.event_id').select('date', 'people_count')
        if (qr_data.length == 0) return res.status(404).json({ error: "Anmeldung nicht gefunden" })

        const RQ_URL = await QRCode.toDataURL(token, { margin: 0 })

        const QR_SVG_EDIT = QR_SVG
            .replace('{{PERSON}}', qr_data[0].people_count == 1 ? 'PERSON' : 'PERSONEN')
            .replace('{{PERSON_X}}', qr_data[0].people_count == 1 ? '970' : '940')
            .replace('{{PEOPLE_COUNT}}', qr_data[0].people_count)
            .replace('{{DATE}}', fns.format(new Date(qr_data[0].date), 'dd/MM/yyyy | HH:mm'))
            .replace('{{TOKEN}}', token)
            .replace('{{QR_URL}}', RQ_URL)

        // res.setHeader('content-type', 'image/svg+xml')
        // return res.status(200).send(QR_SVG_EDIT)
        const png = await convert(QR_SVG_EDIT, { height: 420, width: 950, background: null });

        res.set('content-type', 'image/png');
        res.send(png);
    })
}