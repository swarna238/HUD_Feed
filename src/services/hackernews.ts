import { Story } from '../types';

const HN_API_BASE = 'https://hacker-news.firebaseio.com/v0';
const STORY_CACHE_KEY = 'hn-stories-cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  stories: Story[];
  timestamp: number;
}

export const fetchHackerNewsStories = async (): Promise<Story[]> => {
  // Check cache first
  const cached = localStorage.getItem(STORY_CACHE_KEY);
  if (cached) {
    const cacheEntry: CacheEntry = JSON.parse(cached);
    if (Date.now() - cacheEntry.timestamp < CACHE_DURATION) {
      return cacheEntry.stories;
    }
  }

  try {
    // Fetch top story IDs
    const response = await fetch(`${HN_API_BASE}/topstories.json`);
    const storyIds: number[] = await response.json();
    
    // Get first 50 stories
    const topStoryIds = storyIds.slice(0, 50);
    
    // Fetch individual stories in parallel
    const storyPromises = topStoryIds.map(async (id) => {
      try {
        const storyResponse = await fetch(`${HN_API_BASE}/item/${id}.json`);
        const story: Story = await storyResponse.json();
        return story;
      } catch (error) {
        console.error(`Error fetching story ${id}:`, error);
        return null;
      }
    });
    
    const stories = (await Promise.all(storyPromises))
      .filter((story): story is Story => story !== null && story.type === 'story');
    
    // Cache the results
    const cacheEntry: CacheEntry = {
      stories,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORY_CACHE_KEY, JSON.stringify(cacheEntry));
    
    return stories;
  } catch (error) {
    console.error('Error fetching HackerNews stories:', error);
    
    // Return cached data if available, even if expired
    const cached = localStorage.getItem(STORY_CACHE_KEY);
    if (cached) {
      const cacheEntry: CacheEntry = JSON.parse(cached);
      return cacheEntry.stories;
    }
    
    return [];
  }
};