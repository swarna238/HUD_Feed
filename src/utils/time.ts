export const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now() / 1000;
  const diffInSeconds = Math.floor(now - timestamp);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds}s`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  return `${diffInWeeks}w`;
};