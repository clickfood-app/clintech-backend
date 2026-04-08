import { Request, Response } from 'express'
import { handleChat } from '../services/chat.service'
import { sendTextMessage } from '../services/evolution.service'

function extractMessage(body: any): string {
  return (
    body?.data?.message?.conversation ||
    body?.data?.message?.extendedTextMessage?.text ||
    body?.data?.body ||
    body?.message?.text ||
    ''
  )
}

function extractPatientName(body: any): string {
  return (
    body?.data?.pushName ||
    body?.data?.sender?.pushName ||
    body?.pushName ||
    'Paciente'
  )
}

function extractPhone(body: any): string {
  return (
    body?.data?.key?.remoteJid ||
    body?.data?.sender ||
    body?.sender ||
    body?.phone ||
    ''
  )
}

function normalizePhone(phone: string): string {
  return phone.replace('@s.whatsapp.net', '').replace(/\D/g, '')
}

function shouldIgnoreMessage(body: any): boolean {
  const fromMe =
    body?.data?.key?.fromMe ||
    body?.key?.fromMe ||
    false

  const messageText = extractMessage(body)

  return fromMe || !messageText
}

export async function whatsappWebhook(req: Request, res: Response) {
  try {
    const body = req.body

    console.log('Webhook recebido da Evolution:')
    console.log(JSON.stringify(body, null, 2))

    if (shouldIgnoreMessage(body)) {
      return res.status(200).json({
        success: true,
        ignored: true
      })
    }

    const userMessage = extractMessage(body)
    const patientName = extractPatientName(body)
    const rawPhone = extractPhone(body)
    const phone = normalizePhone(rawPhone)

    if (!phone) {
      return res.status(400).json({
        success: false,
        error: 'Telefone não encontrado no payload'
      })
    }

    const aiResponse = await handleChat({
      userMessage,
      patientName
    })

    await sendTextMessage({
      number: phone,
      text: aiResponse
    })

    return res.status(200).json({
      success: true,
      reply: aiResponse
    })
  } catch (error) {
    console.error('Erro no webhook:', error)
    return res.status(500).json({
      success: false,
      error: 'Erro interno no servidor'
    })
  }
}