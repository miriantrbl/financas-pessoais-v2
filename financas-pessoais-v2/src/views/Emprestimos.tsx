import React from 'react';
import { useApp } from '../store';
import { MES_ABR, fmt } from '../utils';

export default function Emprestimos() {
  const { emprestimos, openModal, removeEmprestimo, cur } = useApp();

  const totalDevendo = emprestimos.reduce((s, e) => {
    const offset = (cur.y - e.startY) * 12 + (cur.m - e.startM);
    const pagas = Math.min(Math.max(0, offset + 1), e.installments);
    return s + (e.total - (e.total / e.installments) * pagas);
  }, 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 23, fontWeight: 800, letterSpacing: '-0.02em' }}>Empréstimos</h1>
          <div style={{ fontSize: 13, color: 'var(--ink2)', marginTop: 2 }}>Parcelas e dívidas em andamento</div>
        </div>
        <button
          onClick={() => openModal({ type: 'emprestimo' })}
          style={{ padding: '10px 18px', borderRadius: 10, background: 'var(--neg)', color: '#fff', fontWeight: 700, fontSize: 14 }}
        >+ Novo empréstimo</button>
      </div>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #C8463E, #8a1f1a)',
        borderRadius: 18, padding: '28px 28px', marginBottom: 20,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -30, top: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Total ainda devido</div>
        <div className="num" style={{ fontSize: 40, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 8 }}>
          {fmt(totalDevendo)}
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
          {emprestimos.length} empréstimo{emprestimos.length !== 1 ? 's' : ''} em andamento
        </div>
      </div>

      {emprestimos.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--ink3)' }}>
          Nenhum empréstimo cadastrado
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {emprestimos.map(e => {
            const offset = (cur.y - e.startY) * 12 + (cur.m - e.startM);
            const parcelaAtual = Math.min(Math.max(1, offset + 1), e.installments);
            const pagas = Math.min(Math.max(0, offset + 1), e.installments);
            const restantes = e.installments - pagas;
            const valorParcela = e.total / e.installments;
            const totalPago = valorParcela * pagas;
            const totalRestante = e.total - totalPago;
            const pct = (pagas / e.installments) * 100;
            const lastIdx = e.startM + e.installments - 1;
            const ultimoMes = MES_ABR[lastIdx % 12] + '/' + (e.startY + Math.floor(lastIdx / 12));

            return (
              <div key={e.id} className="card">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: e.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={e.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{e.desc}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--ink3)', marginTop: 2 }}>
                      última parcela em {ultimoMes}
                    </div>
                  </div>
                  <button
                    onClick={() => { if (confirm('Excluir este empréstimo?')) removeEmprestimo(e.id); }}
                    style={{ color: 'var(--neg)', padding: 6, borderRadius: 7, background: 'var(--surface2)', border: '1px solid var(--border)' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                      <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                    </svg>
                  </button>
                </div>

                {/* Stats row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px,1fr))', gap: 12, marginBottom: 16 }}>
                  {[
                    { label: 'Parcela atual', value: `${parcelaAtual} de ${e.installments}`, color: e.color },
                    { label: 'Valor da parcela', value: fmt(valorParcela), color: 'var(--ink)' },
                    { label: 'Parcelas restantes', value: String(restantes), color: restantes > 0 ? 'var(--neg)' : 'var(--pos)' },
                    { label: 'Total restante', value: fmt(totalRestante), color: 'var(--neg)' },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{ background: 'var(--surface2)', borderRadius: 10, padding: '10px 14px' }}>
                      <div style={{ fontSize: 11.5, color: 'var(--ink3)', marginBottom: 4 }}>{label}</div>
                      <div className="num" style={{ fontSize: 15, fontWeight: 600, color }}>{value}</div>
                    </div>
                  ))}
                </div>

                {/* Progress */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink3)', marginBottom: 6 }}>
                  <span>{Math.round(pct)}% pago</span>
                  <span className="num">{fmt(totalPago)} de {fmt(e.total)}</span>
                </div>
                <div style={{ height: 8, background: 'var(--surface2)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: pct + '%', background: e.color, borderRadius: 4, transition: 'width 0.4s' }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
