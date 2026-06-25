import React, { useState } from 'react';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

type Mode = 'login' | 'cadastro' | 'verificar';

export default function Login() {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogle = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch {
      setError('Erro ao fazer login com Google. Tente novamente.');
      setLoading(false);
    }
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'cadastro') {
      if (senha.length < 10) { setError('A senha deve ter pelo menos 10 caracteres.'); return; }
      if (!/[A-Z]/.test(senha)) { setError('A senha deve conter pelo menos uma letra maiúscula.'); return; }
      if (!/[a-z]/.test(senha)) { setError('A senha deve conter pelo menos uma letra minúscula.'); return; }
      if (!/[0-9]/.test(senha)) { setError('A senha deve conter pelo menos um número.'); return; }
      if (!/[^A-Za-z0-9]/.test(senha)) { setError('A senha deve conter pelo menos um caractere especial (ex: !@#$%).'); return; }
      if (senha !== confirmar) { setError('As senhas não coincidem.'); return; }
    }

    setLoading(true);
    try {
      if (mode === 'cadastro') {
        const cred = await createUserWithEmailAndPassword(auth, email, senha);
        await sendEmailVerification(cred.user);
        await auth.signOut();
        setMode('verificar');
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, senha);
        if (!cred.user.emailVerified) {
          await auth.signOut();
          setError('E-mail não verificado. Verifique sua caixa de entrada e clique no link enviado.');
        }
      }
    } catch (err: any) {
      const msg: Record<string, string> = {
        'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
        'auth/invalid-email': 'E-mail inválido.',
        'auth/user-not-found': 'E-mail não encontrado.',
        'auth/wrong-password': 'Senha incorreta.',
        'auth/invalid-credential': 'E-mail ou senha incorretos.',
        'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos.',
      };
      setError(msg[err.code] || 'Erro ao autenticar. Tente novamente.');
    }
    setLoading(false);
  };

  const inp: React.CSSProperties = {
    width: '100%', padding: '11px 14px', borderRadius: 10, fontSize: 14,
    border: '1.5px solid #E8E5DD', outline: 'none', boxSizing: 'border-box',
    fontFamily: 'Hanken Grotesk, sans-serif',
  };

  const Logo = () => (
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
  );

  if (mode === 'verificar') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F4F3EF', fontFamily: 'Hanken Grotesk, sans-serif' }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: '48px 40px', textAlign: 'center', boxShadow: '0 4px 40px rgba(20,18,12,.10)', maxWidth: 380, width: '100%' }}>
          <Logo />
          <div style={{ fontSize: 40, marginBottom: 16 }}>📧</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Verifique seu e-mail</div>
          <div style={{ fontSize: 14, color: '#6E6A62', marginBottom: 24, lineHeight: 1.6 }}>
            Enviamos um link de confirmação para <strong>{email}</strong>. Clique no link para ativar sua conta.
          </div>
          <button
            onClick={() => setMode('login')}
            style={{ width: '100%', padding: '13px 20px', borderRadius: 12, background: '#1F7A5C', color: '#fff', fontWeight: 700, fontSize: 15 }}
          >
            Ir para o login
          </button>
          <div style={{ marginTop: 16, fontSize: 12, color: '#A7A299' }}>
            Não recebeu? Verifique a pasta de spam.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F4F3EF', fontFamily: 'Hanken Grotesk, sans-serif' }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: '48px 40px', boxShadow: '0 4px 40px rgba(20,18,12,.10)', maxWidth: 380, width: '100%' }}>
        <Logo />

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
            {mode === 'login' ? 'Bem-vinda de volta!' : 'Criar conta'}
          </div>
          <div style={{ fontSize: 14, color: '#6E6A62' }}>
            {mode === 'login' ? 'Acesse suas finanças' : 'Cadastre-se para começar'}
          </div>
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          style={{
            width: '100%', padding: '12px 20px', borderRadius: 12,
            background: loading ? '#E8E5DD' : '#1F7A5C',
            color: loading ? '#A7A299' : '#fff',
            fontWeight: 700, fontSize: 14, marginBottom: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="rgba(255,255,255,0.8)" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="rgba(255,255,255,0.6)" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="rgba(255,255,255,0.9)" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Entrar com Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: '#E8E5DD' }} />
          <span style={{ fontSize: 12, color: '#A7A299' }}>ou</span>
          <div style={{ flex: 1, height: 1, background: '#E8E5DD' }} />
        </div>

        {/* Email form */}
        <form onSubmit={handleEmail} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="email" placeholder="E-mail" required
            value={email} onChange={e => setEmail(e.target.value)}
            style={inp}
          />
          <input
            type="password" placeholder="Senha (mín. 10 chars, A-z, 0-9, !@#)" required
            value={senha} onChange={e => setSenha(e.target.value)}
            style={inp}
          />
          {mode === 'cadastro' && (
            <input
              type="password" placeholder="Confirmar senha" required
              value={confirmar} onChange={e => setConfirmar(e.target.value)}
              style={inp}
            />
          )}

          {error && <div style={{ fontSize: 13, color: '#C8463E' }}>{error}</div>}

          <button
            type="submit" disabled={loading}
            style={{
              width: '100%', padding: '12px 20px', borderRadius: 12,
              background: loading ? '#E8E5DD' : '#1F7A5C',
              color: loading ? '#A7A299' : '#fff',
              fontWeight: 700, fontSize: 14, marginTop: 4,
            }}
          >
            {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: '#6E6A62' }}>
          {mode === 'login' ? (
            <>Não tem conta?{' '}
              <button onClick={() => { setMode('cadastro'); setError(''); }} style={{ color: '#1F7A5C', fontWeight: 700 }}>
                Cadastre-se
              </button>
            </>
          ) : (
            <>Já tem conta?{' '}
              <button onClick={() => { setMode('login'); setError(''); }} style={{ color: '#1F7A5C', fontWeight: 700 }}>
                Entrar
              </button>
            </>
          )}
        </div>

        <div style={{ marginTop: 16, textAlign: 'center', fontSize: 12, color: '#A7A299' }}>
          Seus dados ficam protegidos e só você tem acesso
        </div>
      </div>
    </div>
  );
}
