import React, { useEffect } from 'react';
import { AppProvider, useApp } from './store';
import Header from './components/Header';
import Nav from './components/Nav';
import Modal from './components/Modal';
import Home from './views/Home';
import Receitas from './views/Receitas';
import Despesas from './views/Despesas';
import Cartoes from './views/Cartoes';
import Poupanca from './views/Poupanca';
import './App.css';

function Inner() {
  const { activeTab, theme } = useApp();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Header />
      <Nav />
      <main>
        <div className="content-wrap" style={{ padding: '28px 22px' }}>
          {activeTab === 'inicio' && <Home />}
          {activeTab === 'receitas' && <Receitas />}
          {activeTab === 'despesas' && <Despesas />}
          {activeTab === 'cartoes' && <Cartoes />}
          {activeTab === 'poupanca' && <Poupanca />}
        </div>
      </main>
      <Modal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Inner />
    </AppProvider>
  );
}
