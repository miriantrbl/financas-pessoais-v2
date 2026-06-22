import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch {
      setError('Erro ao fazer login. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#F4F3EF', fontFamily: 'Hanken Grotesk, sans-serif',
    }}>
      <div style={{
        background: '#fff', borderRadius: 20, padding: '48px 40px', textAlign: 'center',
        boxShadow: '0 4px 40px rgba(20,18,12,.10)', maxWidth: 380, width: '100%',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 13, background: '#1F7A5C',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            alignItems: 'center', gap: 4, padding: '9px 10px',
          }}>
            {[16, 12, 8].map((w, i) => (
              <div key={i} style={{ height: 3, width: w, background: '#fff', borderRadius: 2 }} />
            ))}
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>saldo</div>
            <div style={{ fontSize: 12, color: '#A7A299', lineHeight: 1 }}>finanças pessoais</div>
          </div>
        </div>

        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Bem-vinda de volta!</div>
        <div style={{ fontSize: 14, color: '#6E6A62', marginBottom: 32 }}>
          Faça login para acessar suas finanças
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%', padding: '13px 20px', borderRadius: 12,
            background: loading ? '#E8E5DD' : '#1F7A5C',
            color: loading ? '#A7A299' : '#fff',
            fontWeight: 700, fontSize: 15,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            transition: 'all 0.15s', cursor: loading ? 'not-allowed' : 'pointer',
            border: 'none',
          }}
        >
          {!loading && (
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="rgba(255,255,255,0.8)" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="rgba(255,255,255,0.6)" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="rgba(255,255,255,0.9)" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          {loading ? 'Entrando...' : 'Entrar com Google'}
        </button>

        {error && (
          <div style={{ marginTop: 16, fontSize: 13, color: '#C8463E' }}>{error}</div>
        )}

        <div style={{ marginTop: 24, fontSize: 12, color: '#A7A299' }}>
          Seus dados ficam protegidos e só você tem acesso
        </div>
      </div>
    </div>
  );
}
