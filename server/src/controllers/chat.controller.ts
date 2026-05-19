import { Request, Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { env } from '../config/env';

const client = new Anthropic({ apiKey: env.anthropicKey });

export async function chatWithAI(req: Request, res: Response): Promise<void> {
  try {
    const { message, history } = req.body;

    if (!message) {
      res.status(400).json({ success: false, error: 'Mensaje requerido.' });
      return;
    }

    const messages = [
      ...(history || []),
      { role: 'user' as const, content: message }
    ];

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: `Eres CineBot, un asistente experto en películas integrado en StreamMatch, 
una plataforma de recomendación de películas. Tu rol es ayudar a los usuarios a:
- Descubrir películas según sus gustos
- Comparar películas y directores
- Explicar géneros y estilos cinematográficos
- Dar recomendaciones personalizadas
Responde siempre en español, de forma amigable y concisa (máximo 3 párrafos).`,
      messages,
    });

    const reply = response.content[0].type === 'text' ? response.content[0].text : '';

    res.json({ success: true, data: { reply } });
  } catch (error: any) {
    console.error('Error en chat:', error);
    res.status(500).json({
      success: false,
      error: error?.status === 400 ? 'Créditos insuficientes en la API.' : 'Error al procesar el mensaje.',
    });
  }
}