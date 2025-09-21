import { Story, RankingFactors } from '../types';

const RECENCY_WEIGHT = 0.3;
const POPULARITY_WEIGHT = 0.4;
const RELEVANCE_WEIGHT = 0.3;

export const rankStories = (stories: Story[], focusKeyword: string = ''): Story[] => {
  const now = Date.now() / 1000; // Convert to seconds
  
  const scoredStories = stories.map(story => {
    const factors = calculateRankingFactors(story, focusKeyword, now);
    return {
      ...story,
      rankingScore: factors.finalScore,
      factors,
    };
  });

  return scoredStories.sort((a, b) => b.rankingScore - a.rankingScore);
};

const calculateRankingFactors = (
  story: Story,
  focusKeyword: string,
  currentTime: number
): RankingFactors => {
  // Relevance Score (0-1)
  let relevanceScore = 0;
  if (focusKeyword.trim()) {
    const keyword = focusKeyword.toLowerCase();
    const title = story.title.toLowerCase();
    
    if (title.includes(keyword)) {
      // Boost for exact matches
      const exactMatches = (title.match(new RegExp(keyword, 'g')) || []).length;
      relevanceScore = Math.min(exactMatches * 0.5, 1);
    }
  } else {
    // No keyword means all stories are equally relevant
    relevanceScore = 0.5;
  }

  // Popularity Score (0-1)
  // Combines points and comments with logarithmic scaling
  const points = story.score || 0;
  const comments = story.descendants || 0;
  const popularityRaw = points + (comments * 2); // Comments weighted higher
  const popularityScore = Math.min(Math.log(popularityRaw + 1) / Math.log(1000), 1);

  // Recency Score (0-1)
  // Penalty increases over time
  const ageInHours = (currentTime - story.time) / 3600;
  const recencyScore = Math.max(0, 1 - (ageInHours / 24)); // Full penalty after 24 hours

  // Final weighted score
  const finalScore = 
    relevanceScore * RELEVANCE_WEIGHT +
    popularityScore * POPULARITY_WEIGHT +
    recencyScore * RECENCY_WEIGHT;

  return {
    relevanceScore,
    popularityScore,
    recencyScore,
    finalScore,
  };
};

export const calculateRelevanceScore = (text: string, keyword: string): number => {
  if (!keyword.trim()) return 0.5;
  
  const lowerText = text.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  
  if (lowerText.includes(lowerKeyword)) {
    const matches = (lowerText.match(new RegExp(lowerKeyword, 'g')) || []).length;
    return Math.min(matches * 0.3, 1);
  }
  
  return 0;
};