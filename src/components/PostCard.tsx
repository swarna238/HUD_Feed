import React from 'react';
import { ExternalLink, MessageCircle, Bookmark, Clock, TrendingUp } from 'lucide-react';
import { Story } from '../types';
import { formatTimeAgo } from '../utils/time';

interface PostCardProps {
  story: Story;
  isBookmarked: boolean;
  onBookmarkToggle: (storyId: number) => void;
  index: number;
}

const PostCard: React.FC<PostCardProps> = ({
  story,
  isBookmarked,
  onBookmarkToggle,
  index,
}) => {
  const handleClick = () => {
    if (story.url) {
      window.open(story.url, '_blank');
    }
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBookmarkToggle(story.id);
  };

  return (
    <div
      className={`group relative bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 cursor-pointer transition-all duration-300 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-400/10 hover:scale-[1.02] animate-slide-in`}
      style={{ animationDelay: `${index * 0.05}s` }}
      onClick={handleClick}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-xl border border-cyan-400/0 group-hover:border-cyan-400/30 transition-all duration-300 pointer-events-none"></div>
      
      {/* Rank indicator */}
      <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">
        {index + 1}
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Title */}
        <h3 className="text-white font-semibold leading-tight group-hover:text-cyan-300 transition-colors duration-200 pr-8">
          {story.title}
        </h3>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span className="font-mono">{story.score} pts</span>
          </div>
          
          <div className="flex items-center gap-1">
            <MessageCircle className="w-3 h-3" />
            <span className="font-mono">{story.descendants || 0}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span className="font-mono">{formatTimeAgo(story.time)}</span>
          </div>
          
          <div className="text-cyan-400">
            by {story.by}
          </div>
        </div>

        {/* URL */}
        {story.url && (
          <div className="flex items-center gap-2 text-xs text-purple-400 font-mono">
            <ExternalLink className="w-3 h-3" />
            <span className="truncate">{new URL(story.url).hostname}</span>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={handleBookmarkClick}
          className={`p-2 rounded-lg transition-all duration-200 ${
            isBookmarked
              ? 'bg-orange-500/20 text-orange-400 border border-orange-400/30'
              : 'bg-gray-800/50 text-gray-400 border border-gray-600/30 hover:border-orange-400/50 hover:text-orange-400'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
};

export default PostCard;