import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ searchQuery, onSearchChange }) => {
  return (
    <div style={{
      position: 'absolute',
      top: '16px', // Below brand bar inside relative container
      left: '16px',
      right: '16px',
      height: '52px',
      backgroundColor: 'var(--color-bg-primary)',
      borderRadius: 'var(--radius-full)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
      zIndex: 1000
    }}>
      <Search size={20} color="var(--color-icon-secondary)" style={{ marginRight: '12px' }} />
      <input 
        type="text" 
        placeholder="Search location, parking..." 
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{
          border: 'none',
          outline: 'none',
          fontSize: '16px',
          fontFamily: 'var(--font-family)',
          flex: 1,
          color: 'var(--color-text-primary)'
        }}
      />
    </div>
  );
};

export default SearchBar;
