import React from 'react';
import { useApp } from '../store';
import { MES_FULL, fmt, fmtDate } from '../utils';

function catColor(name: string, categories: { name: string; color: string }[]) {
  return categories.find(c => c.name === name)?.color || '#8A867E';
}

export default function Receitas() {
  const { cur, incomes, removeIncome, openModal, categories } = useApp();

  const month = incomes.filter(r => {
    const [y, m] = r.date.split('-').map(Number);
    return y === cur.y && m - 1 === cur.m;
  });

  const total = month.reduce((s, r) => s + r.amount, 0);
  const fixas = month.filter(r => r.recurring).reduce((s, r) => s + r.amount, 0);
  const variaveis = month.filter(r => !r.recurring).reduce((s, r) => s + r.amount, 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 23, fontWeight: 800, letterSpacing: '-0.02em' }}>Receitas</h1>
          <div style={{ fontSize: 13, color: 'var(--ink2)', marginTop: 2 }}>Tudo que entrou em {MES_FULL[cur.m]} {cur.y}</div>
        </div>
        <button
          onClick={() => openModal({ type: 'receita' })}
          style={{ padding: '10px 18px', borderRadius: 10, background: 'var(--accent)', color: '#fff', fontWeight: 700, fontSize: 14 }}
        >+ Nova receita</button>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14, marginBottom: 20 }}>
        <SumCard label="Total recebido" value={total} color="var(--pos)" sub="" />
        <SumCard label="Receitas fixas" value={fixas} color="var(--ink)" sub="salário e recorrentes" />
        <SumCard label="Receitas variáveis" value={variaveis} color="var(--ink)" sub="freelas, extras, reembolsos" />
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0 }}>
        <TableHeader cols={['FONTE', 'CATEGORIA', 'DATA', 'VALOR']} />
        {month.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--ink3)', fontSize: 14 }}>
            Nenhuma receita em {MES_FULL[cur.m]} {cur.y}
          </div>
        ) : (
          month.map((r, i) => (
            <div key={r.id} style={{
              display: 'grid', gridTemplateColumns: '1fr 140px 90px 120px 32px',
              alignItems: 'center', gap: 12, padding: '14px 20px',
              borderTop: i > 0 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pos)', flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.source}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink3)' }}>{r.recurring ? 'recorrente' : 'pontual'}</div>
                </div>
              </div>
              <div>
                <span style={{
                  padding: '3px 10px', borderRadius: 20, fontSize: 12.5, fontWeight: 600,
                  background: catColor(r.category, categories) + '22',
                  color: catColor(r.category, categories),
                }}>{r.category}</span>
              </div>
              <div className="num" style={{ fontSize: 13, color: 'var(--ink2)' }}>{fmtDate(r.date)}</div>
              <div className="num" style={{ fontSize: 15, fontWeight: 600, color: 'var(--pos)', textAlign: 'right' }}>{fmt(r.amount)}</div>
              <button onClick={() => removeIncome(r.id)} style={{ color: 'var(--ink3)', fontSize: 16, lineHeight: 1, padding: 4 }}>×</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function SumCard({ label, value, color, sub }: { label: string; value: number; color: string; sub: string }) {
  return (
    <div className="card">
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink2)', marginBottom: 8 }}>{label}</div>
      <div className="num" style={{ fontSize: 22, fontWeight: 600, color, lineHeight: 1.1 }}>{fmt(value)}</div>
      {sub && <div style={{ fontSize: 12.5, color: 'var(--ink3)', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function TableHeader({ cols }: { cols: string[] }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 140px 90px 120px 32px',
      gap: 12, padding: '12px 20px',
      borderBottom: '1px solid var(--border)',
    }}>
      {cols.map(c => (
        <div key={c} style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ink3)', letterSpacing: '0.04em' }}>{c}</div>
      ))}
    </div>
  );
}
