import React, { useState } from 'react';
import { User, LogOut, Settings, Bookmark, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface UserProfileProps {
  bookmarkCount: number;
}

const UserProfile: React.FC<UserProfileProps> = ({ bookmarkCount }) => {
  const { user, signOut } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-3 p-3 bg-gray-900/30 border border-cyan-500/30 rounded-lg hover:border-cyan-400/50 transition-all duration-200 w-full"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 text-left">
          <div className="text-sm font-medium text-white truncate">
            {user.displayName || user.email?.split('@')[0] || 'User'}
          </div>
          <div className="text-xs text-gray-400 font-mono truncate">
            {user.email}
          </div>
        </div>
      </button>

      {showDropdown && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-900/90 backdrop-blur-md border border-gray-700/50 rounded-lg shadow-xl z-50">
          <div className="p-4 border-b border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">
                  {user.displayName || user.email?.split('@')[0] || 'User'}
                </div>
                <div className="text-xs text-gray-400 font-mono">
                  {user.email}
                </div>
              </div>
            </div>
          </div>

          <div className="p-2">
            <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300">
              <Bookmark className="w-4 h-4 text-orange-400" />
              <span>{bookmarkCount} Bookmarks</span>
            </div>
            
            <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300">
              <Shield className="w-4 h-4 text-green-400" />
              <span>Account Verified</span>
            </div>

            <hr className="my-2 border-gray-700/50" />

            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors w-full"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;