import Anthropic from '@anthropic-ai/sdk';
import { env } from '../config/env';
import { RecommendedMovie } from '../types';

const client = new Anthropic({ apiKey: env.anthropicKey });

// ============================================================
// SERVICIO DE IA — Enriquecimiento con Claude
//
// ¿Qué hace?
// Toma las películas recomendadas por el algoritmo y le pide
// a Claude que genere una explicación personalizada en lenguaje
// natural para cada recomendación, basada en los géneros del usuario.
// ============================================================

export async function enrichWithAI(
  recommendations: RecommendedMovie[],
  userGenres: string[],
  userName?: string
): Promise<RecommendedMovie[]> {
  if (!env.anthropicKey) {
    console.warn('⚠️  ANTHROPIC_API_KEY no configurada. Saltando enriquecimiento con IA.');
    return recommendations;
  }

  try {
    const movieList = recommendations
      .map((m, i) => `${i + 1}. "${m.title}" (${m.year}) — Géneros: ${m.genres}`)
      .join('\n');

    const prompt = `Eres un sistema de recomendación de películas amigable y entusiasta.
    
${userName ? `El usuario se llama ${userName}.` : 'El usuario'} tiene preferencia por los géneros: ${userGenres.join(', ')}.

Se le recomendaron estas películas:
${movieList}

Para cada película, escribe UNA oración corta y personalizada (máximo 20 palabras) explicando por qué le gustará a este usuario, considerando sus géneros favoritos. 

Responde ÚNICAMENTE en formato JSON así, sin texto adicional:
{
  "explanations": [
    "explicación para película 1",
    "explicación para película 2",
    ...
  ]
}`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    if (content.type !== 'text') return recommendations;

    // Limpia posibles markdown backticks antes de parsear
    const cleaned = content.text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    // Agrega la explicación de IA a cada película
    return recommendations.map((movie, i) => ({
      ...movie,
      aiEnrichment: parsed.explanations?.[i] || undefined,
    }));
  } catch (error) {
    console.error('Error al enriquecer con IA:', error);
    // Si falla la IA, devuelve las recomendaciones sin enriquecimiento
    return recommendations;
  }
}
