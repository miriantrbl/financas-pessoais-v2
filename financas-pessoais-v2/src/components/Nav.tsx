import React from 'react';
import { useApp } from '../store';
import type { Tab } from '../types';

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'inicio', label: 'Início', icon: <HomeIcon /> },
  { id: 'receitas', label: 'Receitas', icon: <ArrowUpIcon /> },
  { id: 'despesas', label: 'Despesas', icon: <ArrowDownIcon /> },
  { id: 'cartoes', label: 'Cartões', icon: <CardIcon /> },
  { id: 'poupanca', label: 'Poupança', icon: <PiggyIcon /> },
  { id: 'emprestimos', label: 'Empréstimos', icon: <LoanIcon /> },
];

export default function Nav() {
  const { activeTab, setTab } = useApp();
  return (
    <nav style={{
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 61, zIndex: 29,
    }}>
      <div className="content-wrap" style={{ display: 'flex', overflowX: 'auto', padding: '0 22px' }}>
        {tabs.map(t => {
          const active = t.id === activeTab;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '12px 16px', position: 'relative',
                color: active ? 'var(--ink)' : 'var(--ink2)',
                fontWeight: active ? 700 : 600,
                fontSize: 14, whiteSpace: 'nowrap',
                borderBottom: active ? '2.5px solid var(--accent)' : '2.5px solid transparent',
                transition: 'all 0.15s',
              }}
            >
              <span style={{ color: active ? 'var(--accent)' : 'var(--ink3)', display: 'flex' }}>
                {t.icon}
              </span>
              {t.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function HomeIcon() {
  return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
}
function ArrowUpIcon() {
  return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>;
}
function ArrowDownIcon() {
  return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>;
}
function CardIcon() {
  return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
}
function PiggyIcon() {
  return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 5c-1.5 0-2.8.4-3.9 1-1.2-2-3.2-3.4-5.6-3.4C5.9 2.6 3 5.7 3 9.6 3 14 5.4 17 9 18v3h6v-3c1-.3 1.9-.8 2.7-1.4L19 17l2-2-1.5-1.5c.3-.7.5-1.6.5-2.5 0-3.3-1.8-5-1-6zm0 0c0-1.1.9-2 2-2"/></svg>;
}
function LoanIcon() {
  return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
}
