import React from 'react';
import { useApp } from '../store';
import { fmt } from '../utils';

export default function Poupanca() {
  const { savings, openModal } = useApp();

  const totalGuardado = savings.reduce((s, m) => s + m.current, 0);
  const totalMensal = savings.reduce((s, m) => s + m.monthly, 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 23, fontWeight: 800, letterSpacing: '-0.02em' }}>Poupança</h1>
          <div style={{ fontSize: 13, color: 'var(--ink2)', marginTop: 2 }}>Suas metas e reservas guardadas</div>
        </div>
        <button
          onClick={() => openModal({ type: 'meta' })}
          style={{ padding: '10px 18px', borderRadius: 10, background: 'var(--gold)', color: '#fff', fontWeight: 700, fontSize: 14 }}
        >+ Nova meta</button>
      </div>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, var(--gold), #8a6010)',
        borderRadius: 18, padding: '28px 28px', marginBottom: 20,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -30, top: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Total guardado</div>
        <div className="num" style={{ fontSize: 40, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 8 }}>
          {fmt(totalGuardado)}
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
          aporte mensal planejado · {fmt(totalMensal)}
        </div>
      </div>

      {/* Goals grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))', gap: 14 }}>
        {savings.map(m => {
          const pct = m.target > 0 ? Math.min(100, m.current / m.target * 100) : 0;
          const faltam = m.target - m.current;
          return (
            <div key={m.id} className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: m.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={m.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{m.name}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--ink3)' }}>{Math.round(pct)}% concluído</div>
                </div>
              </div>

              <div style={{ height: 8, background: 'var(--surface2)', borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
                <div style={{ height: '100%', width: pct + '%', background: m.color, borderRadius: 4, transition: 'width 0.4s' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <div className="num" style={{ fontSize: 15, fontWeight: 600, color: m.color }}>{fmt(m.current)}</div>
                <div className="num" style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink3)' }}>{fmt(m.target)}</div>
              </div>

              <div style={{ fontSize: 13, color: 'var(--ink2)', marginBottom: 14 }}>
                faltam <span className="num" style={{ fontWeight: 600 }}>{fmt(Math.max(0, faltam))}</span>
              </div>

              <button
                onClick={() => openModal({ type: 'depositar', metaId: m.id })}
                style={{
                  width: '100%', padding: '9px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                  background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--ink)',
                }}
              >+ Depositar</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
