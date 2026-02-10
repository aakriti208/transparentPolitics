/**
 * Header Component - Navigation header with tabs
 */
import React from 'react';

interface HeaderProps {
  activeTab: 'map' | 'policy' | 'contact';
  onTabChange: (tab: 'map' | 'policy' | 'contact') => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  return (
    <header className="bg-white shadow-md z-[1001]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-900">
              Transparent Politics
            </h1>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-8">
            <button
              onClick={() => onTabChange('map')}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === 'map'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Map
            </button>
            <button
              onClick={() => onTabChange('policy')}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === 'policy'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Policy Impact
            </button>
            <button
              onClick={() => onTabChange('contact')}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === 'contact'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Contact Us
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
