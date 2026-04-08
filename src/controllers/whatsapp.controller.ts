import { Request, Response } from 'express'
import { handleChat } from '../services/chat.service'

export async function whatsappWebhook(req: Request, res: Response) {
  try {
    const body = req.body

    const userMessage =
      body?.message?.text ||
      body?.data?.message?.conversation ||
      body?.data?.body ||
      'Olá'

    const patientName =
      body?.pushName ||
      body?.data?.pushName ||
      body?.data?.sender?.pushName ||
      'Paciente'

    const aiResponse = await handleChat({
      userMessage,
      patientName
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