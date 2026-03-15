import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { ROUTES } from '../utils/constants';

const SearchBar = ({ fullWidth }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} style={{...styles.form, width: fullWidth ? '100%' : 'auto', flex: fullWidth ? 'none' : '0 1 400px'}}>
      <div style={{...styles.searchContainer, width: fullWidth ? '100%' : 'auto'}}>
        <button type="submit" style={styles.iconButton}>
          <Search size={20} color="var(--primary-color)" />
        </button>
        <input
          type="text"
          placeholder="Search music, podcasts, artists"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={styles.input}
        />
      </div>
    </form>
  );
};

const styles = {
  form: {
    marginRight: 'auto',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'var(--bg-hover)',
    borderRadius: '8px',
    padding: '12px 16px',
    border: '1px solid var(--border-color)',
    transition: 'all 0.2s'
  },
  iconButton: {
    background: 'none',
    border: 'none',
    padding: 0,
    marginRight: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--text-primary)',
    width: '100%',
    fontSize: '15px',
    outline: 'none',
  }
};

export default SearchBar;
