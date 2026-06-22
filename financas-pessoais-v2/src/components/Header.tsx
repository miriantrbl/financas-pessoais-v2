import React from 'react';
import type { User } from 'firebase/auth';
import { useApp } from '../store';
import { MES_FULL } from '../utils';

export default function Header({ user, onSignOut }: { user: User; onSignOut: () => void }) {
  const { theme, setTheme, cur, prevMonth, nextMonth } = useApp();

  return (
    <header style={{
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 30,
    }}>
      <div className="content-wrap" style={{ display: 'flex', alignItems: 'center', padding: '12px 22px', gap: 16 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 11, background: 'var(--accent)',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            alignItems: 'center', gap: 3, padding: '7px 8px',
          }}>
            {[14, 10, 7].map((w, i) => (
              <div key={i} style={{ height: 2.5, width: w, background: '#fff', borderRadius: 2 }} />
            ))}
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>saldo</div>
            <div style={{ fontSize: 11, color: 'var(--ink3)', lineHeight: 1 }}>finanças pessoais</div>
          </div>
        </div>

        {/* Month selector */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--surface2)', border: '1px solid var(--border)',
          borderRadius: 20, padding: '6px 14px',
        }}>
          <button onClick={prevMonth} style={{ color: 'var(--ink2)', fontSize: 16, lineHeight: 1, padding: '0 4px' }}>‹</button>
          <span style={{ fontSize: 14, fontWeight: 600, minWidth: 110, textAlign: 'center' }}>
            {MES_FULL[cur.m]} {cur.y}
          </span>
          <button onClick={nextMonth} style={{ color: 'var(--ink2)', fontSize: 16, lineHeight: 1, padding: '0 4px' }}>›</button>
        </div>

        {/* Theme toggle */}
        <div style={{
          display: 'flex', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden',
        }}>
          {(['light', 'dark'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              style={{
                padding: '6px 14px', fontSize: 13, fontWeight: 600,
                background: theme === t ? 'var(--accent)' : 'transparent',
                color: theme === t ? '#fff' : 'var(--ink2)',
                transition: 'all 0.15s',
              }}
            >
              {t === 'light' ? 'Claro' : 'Escuro'}
            </button>
          ))}
        </div>

        {/* User + sign out */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {user.photoURL && (
            <img src={user.photoURL} alt="" style={{ width: 30, height: 30, borderRadius: '50%' }} />
          )}
          <button
            onClick={onSignOut}
            style={{
              fontSize: 13, fontWeight: 600, color: 'var(--ink3)',
              padding: '6px 12px', borderRadius: 8,
              border: '1px solid var(--border)',
            }}
          >Sair</button>
        </div>
      </div>
    </header>
  );
}
