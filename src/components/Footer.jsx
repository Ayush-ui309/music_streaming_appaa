import React from 'react';
import { Instagram, Twitter, Facebook, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.topRow}>
        <div style={styles.column}>
          <p style={styles.colTitle}>Company</p>
          <a href="#" style={styles.link}>About</a>
          <a href="#" style={styles.link}>Jobs</a>
          <a href="#" style={styles.link}>For the Record</a>
        </div>
        <div style={styles.column}>
          <p style={styles.colTitle}>Communities</p>
          <a href="#" style={styles.link}>For Artists</a>
          <a href="#" style={styles.link}>Developers</a>
          <a href="#" style={styles.link}>Advertising</a>
          <a href="#" style={styles.link}>Investors</a>
          <a href="#" style={styles.link}>Vendors</a>
        </div>
        <div style={styles.column}>
          <p style={styles.colTitle}>Useful links</p>
          <a href="#" style={styles.link}>Support</a>
          <a href="#" style={styles.link}>Free Mobile App</a>
        </div>
        <div style={styles.column}>
          <p style={styles.colTitle}>SonicWave Plans</p>
          <a href="#" style={styles.link}>Premium Individual</a>
          <a href="#" style={styles.link}>Premium Duo</a>
          <a href="#" style={styles.link}>Premium Family</a>
          <a href="#" style={styles.link}>Premium Student</a>
          <a href="#" style={styles.link}>SonicWave Free</a>
        </div>
        <div style={styles.socialCol}>
          <div style={styles.socialIcon}><Instagram size={20} /></div>
          <div style={styles.socialIcon}><Twitter size={20} /></div>
          <div style={styles.socialIcon}><Facebook size={20} /></div>
        </div>
      </div>

      <div style={styles.divider}></div>

      <div style={styles.bottomRow}>
        <div style={styles.legalLinks}>
          <a href="#" style={styles.legalLink}>Legal</a>
          <a href="#" style={styles.legalLink}>Safety & Privacy Center</a>
          <a href="#" style={styles.legalLink}>Privacy Policy</a>
          <a href="#" style={styles.legalLink}>Cookies</a>
          <a href="#" style={styles.legalLink}>About Ads</a>
          <a href="#" style={styles.legalLink}>Accessibility</a>
        </div>
        <div style={styles.copyright}>
          &copy; 2026 SonicWave AB
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    padding: '80px 32px 40px 32px',
    backgroundColor: 'var(--bg-color)',
    width: '100%',
    marginTop: 'auto',
  },
  topRow: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '40px',
    justifyContent: 'space-between',
    marginBottom: '40px',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    minWidth: '160px',
  },
  colTitle: {
    fontWeight: '700',
    fontSize: '16px',
    color: 'var(--text-primary)',
    marginBottom: '8px',
  },
  link: {
    color: 'var(--text-secondary)',
    fontSize: '14px',
    textDecoration: 'none',
    transition: 'color 0.2s',
    '&:hover': { color: 'var(--text-primary)' },
  },
  socialCol: {
    display: 'flex',
    gap: '16px',
  },
  socialIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#292929',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  divider: {
    height: '1px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    margin: '40px 0 20px 0',
  },
  bottomRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px',
  },
  legalLinks: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
  },
  legalLink: {
    color: 'var(--text-secondary)',
    fontSize: '12px',
    textDecoration: 'none',
  },
  copyright: {
    color: 'var(--text-secondary)',
    fontSize: '12px',
  },
};

export default Footer;
