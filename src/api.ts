import 'express-async-errors'
import express from 'express'

const app = express()

app.use(express.json())

app.head('/status', (_req, res) => res.sendStatus(200))
app.get('/status', (_req, res) => res.sendStatus(200))

app.use('*', (_req, res) => res.sendStatus(404))

export default app
