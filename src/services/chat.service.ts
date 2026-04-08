import { openai } from '../config/openai'

type HandleChatInput = {
  userMessage: string
  patientName?: string
}

export async function handleChat({ userMessage, patientName }: HandleChatInput) {
  const systemPrompt = `
Você é a atendente virtual de uma clínica.
Seu objetivo é atender de forma humana, clara, educada e natural.
Nunca soe robótica.
Responda como uma recepcionista experiente e simpática.
Se o paciente demonstrar interesse, conduza com leveza para o agendamento.
Nome do paciente: ${patientName || 'não informado'}.
`

  const response = await openai.responses.create({
    model: 'gpt-4.1-mini',
    input: [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: userMessage
      }
    ]
  })

  return response.output_text
}