export interface Story {
  id: number;
  title: string;
  url?: string;
  score: number;
  by: string;
  time: number;
  descendants?: number;
  type: string;
}

export interface RankingFactors {
  relevanceScore: number;
  popularityScore: number;
  recencyScore: number;
  finalScore: number;
}