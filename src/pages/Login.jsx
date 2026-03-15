import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/authService';
import { ROUTES } from '../utils/constants';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const { error: loginError } = await authService.login(email, password);
        if (loginError) throw loginError;
        navigate(ROUTES.HOME);
      } else {
        const { error: signupError } = await authService.signUp(email, password, name);
        if (signupError) throw signupError;
        alert("Signup successful! Please log in.");
        setIsLogin(true);
      }
    } catch (err) {
      if (err.message?.toLowerCase().includes('rate limit')) {
        setError('Too many requests. Please wait a few minutes before trying again.');
      } else if (err.message?.toLowerCase().includes('signup limit')) {
        setError('Signup limit reached for today. Please try again tomorrow or use a different network.');
      } else {
        setError(err.message || 'An error occurred during authentication.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={20} color="var(--text-primary)" />
        </button>
        <div style={styles.logo}>SonicWave</div>
      </div>

      <div style={styles.content}>
        <h1 style={styles.title}>{isLogin ? 'Welcome Back' : 'Join SonicWave'}</h1>
        <p style={styles.subtitle}>
          {isLogin ? 'Sign in to continue your musical journey.' : 'Sign up to discover new sounds and experiences.'}
        </p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                style={styles.input} 
                placeholder="Enter your name" 
                required 
              />
            </div>
          )}
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              style={styles.input} 
              placeholder="name@example.com" 
              required 
            />
          </div>

          <div style={styles.inputGroup}>
            <div style={styles.labelRow}>
              <label style={styles.label}>Password</label>
              {isLogin && <span style={styles.forgotLink}>Forgot password?</span>}
            </div>
            <div style={styles.passwordWrapper}>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                style={{ ...styles.input, paddingRight: '48px' }} 
                placeholder="Enter your password" 
                required 
              />
              <button 
                type="button"
                style={styles.eyeBtn}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} color="var(--text-secondary)" /> : <Eye size={18} color="var(--text-secondary)" />}
              </button>
            </div>
          </div>

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div style={styles.dividerContainer}>
          <hr style={styles.dividerLine} />
          <span style={styles.dividerText}>OR CONTINUE WITH</span>
          <hr style={styles.dividerLine} />
        </div>
        
        <div style={styles.socialAuth}>
          <button style={styles.socialBtn}>
            <span style={{ fontWeight: '600' }}>Google</span>
          </button>
          <button style={styles.socialBtn}>
            <span style={{ fontWeight: '600' }}>Apple</span>
          </button>
        </div>

        <p style={styles.bottomText}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span style={styles.bottomLink} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Create account' : 'Sign In'}
          </span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#0A110D', // Very dark green background
    background: 'radial-gradient(circle at 50% 120%, rgba(77, 244, 120, 0.15), #0A110D 50%)',
    padding: '24px',
    color: '#fff',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
    maxWidth: '500px',
    margin: '0 auto',
    width: '100%',
  },
  backBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  logo: {
    color: 'var(--primary-color)',
    fontSize: '20px',
    fontWeight: '800',
    letterSpacing: '-0.5px',
  },
  content: {
    width: '100%',
    maxWidth: '400px',
    margin: '0 auto',
  },
  title: {
    fontSize: '36px',
    fontWeight: '800',
    marginBottom: '12px',
    letterSpacing: '-1px',
  },
  subtitle: {
    color: 'var(--text-secondary)',
    fontSize: '15px',
    marginBottom: '40px',
    lineHeight: '1.5',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  labelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  forgotLink: {
    fontSize: '13px',
    color: 'var(--primary-color)',
    fontWeight: '600',
    cursor: 'pointer',
  },
  passwordWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    backgroundColor: '#111822', // Very dark navy
    color: 'var(--text-primary)',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  eyeBtn: {
    position: 'absolute',
    right: '16px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtn: {
    marginTop: '16px',
    padding: '16px',
    fontSize: '16px',
    fontWeight: '700',
    backgroundColor: 'var(--primary-color)',
    color: '#000',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 8px 24px rgba(77, 244, 120, 0.2)',
  },
  errorBox: {
    backgroundColor: 'var(--error-color)',
    color: '#fff',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '24px',
    fontSize: '14px',
  },
  dividerContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    margin: '32px 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    border: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dividerText: {
    color: 'var(--text-secondary)',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '1px',
  },
  socialAuth: {
    display: 'flex',
    gap: '16px',
    marginBottom: '40px',
  },
  socialBtn: {
    flex: 1,
    padding: '16px',
    borderRadius: '12px',
    backgroundColor: '#111822',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  bottomText: {
    textAlign: 'center',
    color: 'var(--text-secondary)',
    fontSize: '14px',
  },
  bottomLink: {
    color: 'var(--primary-color)',
    fontWeight: '700',
    cursor: 'pointer',
  }
};

export default Login;
