import dotenv from 'dotenv'

dotenv.config()

const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY
const EVOLUTION_INSTANCE = process.env.EVOLUTION_INSTANCE

if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY || !EVOLUTION_INSTANCE) {
  throw new Error(
    'EVOLUTION_API_URL, EVOLUTION_API_KEY e EVOLUTION_INSTANCE precisam estar definidos.'
  )
}

type SendTextMessageInput = {
  number: string
  text: string
}

function normalizeNumber(number: string) {
  return number.replace(/\D/g, '')
}

export async function sendTextMessage({
  number,
  text
}: SendTextMessageInput) {
  const cleanNumber = normalizeNumber(number)

  const response = await fetch(
    `${EVOLUTION_API_URL}/message/sendText/${EVOLUTION_INSTANCE}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: EVOLUTION_API_KEY
      },
      body: JSON.stringify({
        number: cleanNumber,
        text
      })
    }
  )

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Erro ao enviar mensagem pela Evolution: ${errorText}`)
  }

  return response.json()
}