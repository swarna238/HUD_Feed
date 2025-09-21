import React from 'react';
import { Search, Settings, Bookmark, Zap, Play, Pause, LogIn } from 'lucide-react';
import { Story } from '../types';
import { useAuth } from '../hooks/useAuth';
import UserProfile from './UserProfile';

interface SidebarProps {
  focusKeyword: string;
  onFocusKeywordChange: (keyword: string) => void;
  scrollSpeed: number;
  onScrollSpeedChange: (speed: number) => void;
  isAutoScrolling: boolean;
  onAutoScrollToggle: (enabled: boolean) => void;
  bookmarkedStories: Story[];
  onBookmarkClick: (storyId: number) => void;
  onAuthClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  focusKeyword,
  onFocusKeywordChange,
  scrollSpeed,
  onScrollSpeedChange,
  isAutoScrolling,
  onAutoScrollToggle,
  bookmarkedStories,
  onBookmarkClick,
  onAuthClick,
}) => {
  const { user } = useAuth();

  return (
    <div className="w-80 bg-black/40 backdrop-blur-md border-r border-cyan-500/30 p-6 flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            HUD FEED
          </h1>
        </div>
        <div className="text-xs text-gray-400 font-mono">
          NEURAL INTERFACE v2.1
        </div>
      </div>

      {/* User Profile or Auth Button */}
      <div className="mb-6">
        {user ? (
          <UserProfile bookmarkCount={bookmarkedStories.length} />
        ) : (
          <button
            onClick={onAuthClick}
            className="flex items-center gap-3 p-3 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border border-cyan-400/30 rounded-lg hover:border-cyan-400/60 transition-all duration-200 w-full"
          >
            <LogIn className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 font-mono text-sm uppercase tracking-wider">
              Connect Neural Link
            </span>
          </button>
        )}
      </div>

      {/* Focus Input */}
      <div className="mb-6">
        <label className="block text-xs text-cyan-400 mb-2 font-mono uppercase tracking-wider">
          <Search className="inline w-3 h-3 mr-1" />
          Focus Target
        </label>
        <div className="relative">
          <input
            type="text"
            value={focusKeyword}
            onChange={(e) => onFocusKeywordChange(e.target.value)}
            placeholder="Enter keyword..."
            className="w-full bg-gray-900/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all duration-200"
          />
          <div className="absolute inset-0 rounded-lg border border-cyan-400/20 animate-pulse pointer-events-none"></div>
        </div>
      </div>

      {/* Auto-scroll Controls */}
      <div className="mb-6">
        <label className="block text-xs text-purple-400 mb-3 font-mono uppercase tracking-wider">
          <Zap className="inline w-3 h-3 mr-1" />
          Auto-Scroll Control
        </label>
        
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => onAutoScrollToggle(!isAutoScrolling)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono uppercase transition-all duration-200 ${
              isAutoScrolling
                ? 'bg-purple-600/30 text-purple-300 border border-purple-400/30'
                : 'bg-gray-800/50 text-gray-400 border border-gray-600/30 hover:border-purple-400/30'
            }`}
          >
            {isAutoScrolling ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {isAutoScrolling ? 'Active' : 'Paused'}
          </button>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-400 font-mono">
            <span>Speed</span>
            <span>{scrollSpeed}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={scrollSpeed}
            onChange={(e) => onScrollSpeedChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      {/* Bookmarks */}
      {user && (
        <div className="flex-1 overflow-hidden">
        <label className="block text-xs text-orange-400 mb-3 font-mono uppercase tracking-wider">
          <Bookmark className="inline w-3 h-3 mr-1" />
          Saved ({bookmarkedStories.length})
        </label>
        
        <div className="space-y-2 overflow-y-auto max-h-64 pr-2">
          {bookmarkedStories.length === 0 ? (
            <div className="text-xs text-gray-500 italic">No bookmarks yet</div>
          ) : (
            bookmarkedStories.map((story) => (
              <div
                key={story.id}
                className="p-3 bg-gray-900/30 border border-orange-400/20 rounded-lg hover:border-orange-400/40 transition-all duration-200 cursor-pointer group"
                onClick={() => window.open(story.url, '_blank')}
              >
                <div className="text-xs text-orange-300 font-medium leading-tight mb-1 group-hover:text-orange-200">
                  {story.title.slice(0, 60)}...
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-400 font-mono">
                    {story.score} pts
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onBookmarkClick(story.id);
                    }}
                    className="text-orange-400 hover:text-red-400 transition-colors"
                  >
                    <Bookmark className="w-3 h-3 fill-current" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        </div>
      )}

      {/* Status */}
      <div className="mt-6 pt-4 border-t border-gray-700/50">
        <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
          <span>STATUS</span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>{user ? 'AUTHENTICATED' : 'GUEST MODE'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;