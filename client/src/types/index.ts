export interface Movie {
  id: number;
  title: string;
  genres: string;
  year: number | null;
  image_url: string | null;
  description: string | null;
}

export interface RecommendedMovie extends Movie {
  score: number;
  aiEnrichment?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface RecommendationRequest {
  genres: string[];
  userId?: number;
  userName?: string;
}
