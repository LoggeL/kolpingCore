module.exports = (app, db) => {
    app.get('/api/public/theater/event', async (req, res) => {
        const data = await db('event').select('*')
        return res.status(200).json(data)
    })
}