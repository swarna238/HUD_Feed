import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import Feed from './Feed';
import AuthModal from './AuthModal';
import { fetchHackerNewsStories } from '../services/hackernews';
import { rankStories } from '../utils/ranking';
import { Story } from '../types';
import { useAuth } from '../hooks/useAuth';

const HudInterface: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [filteredStories, setFilteredStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [focusKeyword, setFocusKeyword] = useState('');
  const [scrollSpeed, setScrollSpeed] = useState(50);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const { user } = useAuth();

  // Load bookmarks from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('hud-bookmarks');
    if (savedBookmarks) {
      setBookmarks(new Set(JSON.parse(savedBookmarks)));
    }
  }, []);

  // Fetch and rank stories
  useEffect(() => {
    const loadStories = async () => {
      setLoading(true);
      try {
        const fetchedStories = await fetchHackerNewsStories();
        const rankedStories = rankStories(fetchedStories, focusKeyword);
        setStories(rankedStories);
        setFilteredStories(rankedStories);
      } catch (error) {
        console.error('Error loading stories:', error);
      }
      setLoading(false);
    };

    loadStories();
  }, [focusKeyword]);

  // Filter stories based on focus keyword
  useEffect(() => {
    if (!focusKeyword.trim()) {
      setFilteredStories(stories);
    } else {
      const filtered = stories.filter(story =>
        story.title.toLowerCase().includes(focusKeyword.toLowerCase())
      );
      setFilteredStories(filtered);
    }
  }, [stories, focusKeyword]);

  const toggleBookmark = (storyId: number) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    const newBookmarks = new Set(bookmarks);
    if (newBookmarks.has(storyId)) {
      newBookmarks.delete(storyId);
    } else {
      newBookmarks.add(storyId);
    }
    setBookmarks(newBookmarks);
    localStorage.setItem(`hud-bookmarks-${user.id}`, JSON.stringify([...newBookmarks]));
  };

  // Load user-specific bookmarks when user changes
  useEffect(() => {
    if (user) {
      const savedBookmarks = localStorage.getItem(`hud-bookmarks-${user.id}`);
      if (savedBookmarks) {
        setBookmarks(new Set(JSON.parse(savedBookmarks)));
      } else {
        setBookmarks(new Set());
      }
    } else {
      setBookmarks(new Set());
    }
  }, [user]);

  const getBookmarkedStories = () => {
    return stories.filter(story => bookmarks.has(story.id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      {/* Scanning line animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="scanning-line"></div>
      </div>
      
      {/* Background grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid-pattern"></div>
      </div>

      <div className="flex h-screen relative z-10">
        <Sidebar
          focusKeyword={focusKeyword}
          onFocusKeywordChange={setFocusKeyword}
          scrollSpeed={scrollSpeed}
          onScrollSpeedChange={setScrollSpeed}
          isAutoScrolling={isAutoScrolling}
          onAutoScrollToggle={setIsAutoScrolling}
          bookmarkedStories={getBookmarkedStories()}
          onBookmarkClick={toggleBookmark}
          onAuthClick={() => setShowAuthModal(true)}
        />
        
        <Feed
          stories={filteredStories}
          loading={loading}
          scrollSpeed={scrollSpeed}
          isAutoScrolling={isAutoScrolling}
          bookmarks={bookmarks}
          onBookmarkToggle={toggleBookmark}
        />
      </div>
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default HudInterface;