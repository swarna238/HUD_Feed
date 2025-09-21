import React, { useEffect, useRef } from 'react';
import PostCard from './PostCard';
import { Story } from '../types';
import { Loader2 } from 'lucide-react';

interface FeedProps {
  stories: Story[];
  loading: boolean;
  scrollSpeed: number;
  isAutoScrolling: boolean;
  bookmarks: Set<number>;
  onBookmarkToggle: (storyId: number) => void;
}

const Feed: React.FC<FeedProps> = ({
  stories,
  loading,
  scrollSpeed,
  isAutoScrolling,
  bookmarks,
  onBookmarkToggle,
}) => {
  const feedRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!isAutoScrolling || !feedRef.current) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const feed = feedRef.current;
    let scrollPosition = feed.scrollTop;

    const animate = () => {
      const scrollStep = (scrollSpeed / 100) * 0.5;
      scrollPosition += scrollStep;

      if (scrollPosition >= feed.scrollHeight - feed.clientHeight) {
        scrollPosition = 0;
      }

      feed.scrollTop = scrollPosition;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAutoScrolling, scrollSpeed]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mx-auto mb-4" />
          <div className="text-cyan-400 font-mono text-sm">INITIALIZING NEURAL FEED...</div>
          <div className="text-gray-500 font-mono text-xs mt-2">Connecting to data streams</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden relative">
      {/* Feed header */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-6 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white mb-1">Live Feed</h2>
            <div className="text-xs text-gray-400 font-mono">
              {stories.length} stories • {isAutoScrolling ? 'AUTO' : 'MANUAL'} MODE
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-cyan-400 font-mono">NEURAL SYNC</div>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable feed */}
      <div
        ref={feedRef}
        className="h-full overflow-y-auto pt-24 pb-6 px-6 space-y-4 scrollbar-hide"
        style={{
          scrollBehavior: isAutoScrolling ? 'auto' : 'smooth',
        }}
      >
        {stories.map((story, index) => (
          <PostCard
            key={story.id}
            story={story}
            isBookmarked={bookmarks.has(story.id)}
            onBookmarkToggle={onBookmarkToggle}
            index={index}
          />
        ))}
        
        {stories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 font-mono">No stories match your focus target</div>
            <div className="text-gray-600 text-sm mt-2">Try adjusting your search criteria</div>
          </div>
        )}
      </div>

      {/* Gradient overlays */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default Feed;