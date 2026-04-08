import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import whatsappRoutes from './routes/whatsapp.routes'

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT) || 3000

app.use(cors())
app.use(express.json())

app.get('/', (_req, res) => {
  res.send('Clintech backend rodando.')
})

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true })
})

app.use('/whatsapp', whatsappRoutes)

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})