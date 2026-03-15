import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

const ICONS = { success: '✓', error: '✕', info: 'ℹ' };
const COLORS = {
  success: { bg: 'rgba(77,244,120,0.12)', border: 'rgba(77,244,120,0.3)', icon: '#4df478' },
  error:   { bg: 'rgba(255,77,77,0.12)',  border: 'rgba(255,77,77,0.3)',  icon: '#ff4d4d' },
  info:    { bg: 'rgba(100,160,255,0.12)', border: 'rgba(100,160,255,0.3)', icon: '#64a0ff' },
};

const ToastContainer = ({ toasts, onRemove }) => (
  <div style={{
    position: 'fixed', top: '24px', right: '24px',
    zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px',
    pointerEvents: 'none',
  }}>
    {toasts.map(toast => {
      const c = COLORS[toast.type] || COLORS.info;
      return (
        <div key={toast.id} style={{
          background: c.bg,
          border: `1px solid ${c.border}`,
          borderRadius: '12px',
          padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: '12px',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          pointerEvents: 'auto',
          animation: 'toastIn 0.3s ease',
          minWidth: '240px', maxWidth: '340px',
          cursor: 'pointer',
        }} onClick={() => onRemove(toast.id)}>
          <span style={{
            width: '24px', height: '24px', borderRadius: '50%',
            background: c.border, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '13px', fontWeight: 'bold',
            color: c.icon, flexShrink: 0,
          }}>{ICONS[toast.type]}</span>
          <span style={{ fontSize: '14px', fontWeight: '500', color: '#fff', flex: 1 }}>
            {toast.message}
          </span>
        </div>
      );
    })}
  </div>
);
