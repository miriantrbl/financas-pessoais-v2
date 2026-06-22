import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from './firebase';
import { AppProvider, useApp } from './store';
import Header from './components/Header';
import Nav from './components/Nav';
import Modal from './components/Modal';
import Login from './components/Login';
import Home from './views/Home';
import Receitas from './views/Receitas';
import Despesas from './views/Despesas';
import Cartoes from './views/Cartoes';
import Poupanca from './views/Poupanca';
import Emprestimos from './views/Emprestimos';
import './App.css';

function Inner({ user }: { user: User }) {
  const { activeTab, theme } = useApp();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Header user={user} onSignOut={() => signOut(auth)} />
      <Nav />
      <main>
        <div className="content-wrap" style={{ padding: '28px 22px' }}>
          {activeTab === 'inicio' && <Home />}
          {activeTab === 'receitas' && <Receitas />}
          {activeTab === 'despesas' && <Despesas />}
          {activeTab === 'cartoes' && <Cartoes />}
          {activeTab === 'poupanca' && <Poupanca />}
          {activeTab === 'emprestimos' && <Emprestimos />}
        </div>
      </main>
      <Modal />
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null | 'loading'>('loading');

  useEffect(() => {
    return onAuthStateChanged(auth, u => setUser(u));
  }, []);

  if (user === 'loading') {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#F4F3EF', fontFamily: 'Hanken Grotesk, sans-serif',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#1F7A5C', marginBottom: 8 }}>saldo</div>
          <div style={{ fontSize: 14, color: '#6E6A62' }}>carregando...</div>
        </div>
      </div>
    );
  }

  if (!user) return <Login />;

  return (
    <AppProvider>
      <Inner user={user} />
    </AppProvider>
  );
}
