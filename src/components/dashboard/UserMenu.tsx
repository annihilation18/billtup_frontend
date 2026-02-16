import React, { useState, useEffect, useRef } from 'react';
import { LogOut, User, Settings, Building2, ChevronDown } from 'lucide-react@0.468.0';
import { fetchBusinessProfile } from '../../utils/dashboard-api';
import { getUserEmail } from '../../utils/auth/cognito';

interface UserMenuProps {
  onSignOut: () => void;
  onNavigateToSettings?: () => void;
}

export function UserMenu({ onSignOut, onNavigateToSettings }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [businessProfile, setBusinessProfile] = useState<any>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const loadData = async () => {
    try {
      const profile = await fetchBusinessProfile();
      setBusinessProfile(profile);

      // Get authenticated user's email from Cognito tokens
      const email = getUserEmail();
      if (email) {
        setUserEmail(email);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const getInitials = () => {
    if (businessProfile?.businessName) {
      return businessProfile.businessName
        .split(' ')
        .map((word: string) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return 'BU';
  };

  const handleSignOut = () => {
    setIsOpen(false);
    onSignOut();
  };

  const handleSettings = () => {
    setIsOpen(false);
    onNavigateToSettings?.();
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-gray-100 rounded-lg p-1.5 transition-colors"
      >
        {businessProfile?.logo ? (
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#14B8A6] shadow-sm">
            <img 
              src={businessProfile.logo} 
              alt={businessProfile.businessName || 'Business'} 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#14B8A6] flex items-center justify-center text-white text-sm shadow-sm">
            {getInitials()}
          </div>
        )}
        <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform hidden sm:block ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-3">
              {businessProfile?.logo ? (
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#14B8A6]">
                  <img 
                    src={businessProfile.logo} 
                    alt={businessProfile.businessName || 'Business'} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#14B8A6] flex items-center justify-center text-white">
                  {getInitials()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {businessProfile?.businessName || 'Business Name'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {userEmail || 'email@example.com'}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              onClick={handleSettings}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-500" />
              <span>Settings</span>
            </button>
            <button
              onClick={handleSettings}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Building2 className="w-4 h-4 text-gray-500" />
              <span>Business Profile</span>
            </button>
          </div>

          {/* Sign Out */}
          <div className="border-t border-gray-200 pt-1">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}