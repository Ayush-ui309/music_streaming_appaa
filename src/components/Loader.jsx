import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ text = "Loading..." }) => {
  return (
    <div style={styles.container}>
      <Loader2 size={48} color="var(--primary-color)" className="spinner" />
      <p style={styles.text}>{text}</p>
      <style>{`
        .spinner {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    minHeight: '200px',
    color: 'var(--text-secondary)'
  },
  text: {
    marginTop: '16px',
    fontWeight: '500'
  }
};

export default Loader;
