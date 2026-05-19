// ============================================================
// Tipos globales del servidor
// ============================================================

export interface Movie {
  id: number;
  title: string;
  genres: string;
  year: number | null;
  image_url: string | null;
  description: string | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Rating {
  user_id: number;
  movie_id: number;
  rating: number;
}

export interface RecommendationRequest {
  userId?: number;       // Si el usuario ya existe en la BD
  genres: string[];      // Géneros favoritos seleccionados
  userName?: string;     // Nombre para personalizar respuesta de IA
}

export interface RecommendedMovie extends Movie {
  score: number;         // Score calculado por el algoritmo
  aiEnrichment?: string; // Explicación generada por Claude
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
