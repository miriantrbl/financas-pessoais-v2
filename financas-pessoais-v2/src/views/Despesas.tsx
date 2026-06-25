import React from 'react';
import { useApp } from '../store';
import { MES_FULL, fmt, fmtDate, loanInstallmentInfo, installmentInfo } from '../utils';

function catColor(name: string, categories: { name: string; color: string }[]) {
  return categories.find(c => c.name === name)?.color || '#8A867E';
}

function PaidToggle({ paid, onToggle }: { paid: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      title={paid ? 'Marcar como pendente' : 'Marcar como pago'}
      style={{
        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
        border: paid ? 'none' : '2px solid var(--border)',
        background: paid ? 'var(--pos)' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'all 0.15s',
      }}
    >
      {paid && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </button>
  );
}

export default function Despesas() {
  const { cur, expenses, emprestimos, removeExpense, openModal, categories, filterCat, setFilterCat, payments, togglePaid, cards, purchases } = useApp();

  const month = expenses.filter(e => {
    const [y, m] = e.date.split('-').map(Number);
    return y === cur.y && m - 1 === cur.m;
  });

  const loanParcelas = emprestimos
    .filter(e => loanInstallmentInfo(e, cur.y, cur.m).included)
    .map(e => ({ ...e, valorParcela: loanInstallmentInfo(e, cur.y, cur.m).valorParcela }));

  const cardFaturas = cards.map(card => {
    const total = purchases
      .filter(p => p.cardId === card.id)
      .reduce((s, p) => {
        const { included, valorParcela } = installmentInfo(p, cur.y, cur.m);
        return s + (included ? valorParcela : 0);
      }, 0);
    return { card, total };
  }).filter(x => x.total > 0);

  const loanTotal = loanParcelas.reduce((s, e) => s + e.valorParcela, 0);
  const cardTotal = cardFaturas.reduce((s, x) => s + x.total, 0);
  const total = month.reduce((s, e) => s + e.amount, 0) + loanTotal + cardTotal;

  const allItems = [
    ...month.map(e => ({ key: `expense-${e.id}`, amount: e.amount })),
    ...loanParcelas.map(e => ({ key: `loan-${e.id}-${cur.y}-${cur.m}`, amount: e.valorParcela })),
    ...cardFaturas.map(x => ({ key: `card-${x.card.id}-${cur.y}-${cur.m}`, amount: x.total })),
  ];
  const paidTotal = allItems.filter(x => payments[x.key]).reduce((s, x) => s + x.amount, 0);
  const pendente = total - paidTotal;

  const fixas = month.filter(e => e.type === 'Fixa').reduce((s, e) => s + e.amount, 0);
  const variaveis = month.filter(e => e.type === 'Variável').reduce((s, e) => s + e.amount, 0);

  const filtered = filterCat === 'Todas' ? month : month.filter(e => e.category === filterCat);

  const ROW = '28px 1fr 140px 90px 110px 120px 32px';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 23, fontWeight: 800, letterSpacing: '-0.02em' }}>Despesas</h1>
          <div style={{ fontSize: 13, color: 'var(--ink2)', marginTop: 2 }}>Gastos fixos e variáveis de {MES_FULL[cur.m]} {cur.y}</div>
        </div>
        <button
          onClick={() => openModal({ type: 'despesa' })}
          style={{ padding: '10px 18px', borderRadius: 10, background: 'var(--neg)', color: '#fff', fontWeight: 700, fontSize: 14 }}
        >+ Nova despesa</button>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: 14, marginBottom: 20 }}>
        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink2)', marginBottom: 8 }}>Total do mês</div>
          <div className="num" style={{ fontSize: 22, fontWeight: 600, color: 'var(--neg)', lineHeight: 1.1 }}>{fmt(total)}</div>
          <div style={{ fontSize: 12.5, color: 'var(--ink3)', marginTop: 4 }}>inclui empréstimos e cartões</div>
        </div>
        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink2)', marginBottom: 8 }}>✓ Pago</div>
          <div className="num" style={{ fontSize: 22, fontWeight: 600, color: 'var(--pos)', lineHeight: 1.1 }}>{fmt(paidTotal)}</div>
        </div>
        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink2)', marginBottom: 8 }}>⏳ Pendente</div>
          <div className="num" style={{ fontSize: 22, fontWeight: 600, color: pendente > 0 ? 'var(--gold)' : 'var(--pos)', lineHeight: 1.1 }}>{fmt(pendente)}</div>
        </div>
        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink2)', marginBottom: 8 }}>Fixas</div>
          <div className="num" style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.1 }}>{fmt(fixas)}</div>
        </div>
        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink2)', marginBottom: 8 }}>Variáveis</div>
          <div className="num" style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.1 }}>{fmt(variaveis)}</div>
        </div>
      </div>

      {/* Category filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {['Todas', ...categories.map(c => c.name)].map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            style={{
              padding: '7px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600,
              background: filterCat === cat ? 'var(--accent)' : 'var(--surface)',
              color: filterCat === cat ? '#fff' : 'var(--ink2)',
              border: '1px solid var(--border)',
              transition: 'all 0.15s',
            }}
          >{cat}</button>
        ))}
        <button
          onClick={() => openModal({ type: 'categoria' })}
          style={{
            padding: '7px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600,
            background: 'transparent', color: 'var(--ink3)',
            border: '1.5px dashed var(--border)',
          }}
        >+ Categoria</button>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: ROW, gap: 12, padding: '12px 20px', borderBottom: '1px solid var(--border)' }}>
          {['', 'DESCRIÇÃO', 'CATEGORIA', 'DATA', 'TIPO', 'VALOR', ''].map((c, i) => (
            <div key={i} style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ink3)', letterSpacing: '0.04em' }}>{c}</div>
          ))}
        </div>

        {filtered.length === 0 && loanParcelas.length === 0 && cardFaturas.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--ink3)', fontSize: 14 }}>Nenhuma despesa encontrada</div>
        ) : (
          <>
            {/* Expenses */}
            {filtered.map((e, i) => {
              const color = catColor(e.category, categories);
              const key = `expense-${e.id}`;
              const paid = !!payments[key];
              return (
                <div key={e.id} style={{
                  display: 'grid', gridTemplateColumns: ROW,
                  alignItems: 'center', gap: 12, padding: '14px 20px',
                  borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                  opacity: paid ? 0.45 : 1, transition: 'opacity 0.2s',
                }}>
                  <PaidToggle paid={paid} onToggle={() => togglePaid(key)} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: color + '22', flexShrink: 0 }} />
                    <div style={{ fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: paid ? 'line-through' : 'none' }}>{e.desc}</div>
                  </div>
                  <div><span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12.5, fontWeight: 600, background: color + '22', color }}>{e.category}</span></div>
                  <div className="num" style={{ fontSize: 13, color: 'var(--ink2)' }}>{fmtDate(e.date)}</div>
                  <div><span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 12.5, fontWeight: 600, background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--ink2)' }}>{e.type}</span></div>
                  <div className="num" style={{ fontSize: 15, fontWeight: 600, color: 'var(--neg)', textAlign: 'right' }}>{fmt(e.amount)}</div>
                  <button onClick={() => removeExpense(e.id)} style={{ color: 'var(--ink3)', fontSize: 16, lineHeight: 1, padding: 4 }}>×</button>
                </div>
              );
            })}

            {/* Loan installments */}
            {loanParcelas.map(e => {
              const key = `loan-${e.id}-${cur.y}-${cur.m}`;
              const paid = !!payments[key];
              return (
                <div key={e.id} style={{
                  display: 'grid', gridTemplateColumns: ROW,
                  alignItems: 'center', gap: 12, padding: '14px 20px',
                  borderTop: '1px solid var(--border)',
                  opacity: paid ? 0.45 : 1, transition: 'opacity 0.2s',
                }}>
                  <PaidToggle paid={paid} onToggle={() => togglePaid(key)} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: e.color + '22', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={e.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: paid ? 'line-through' : 'none' }}>{e.desc}</div>
                  </div>
                  <div><span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12.5, fontWeight: 600, background: e.color + '22', color: e.color }}>Empréstimo</span></div>
                  <div className="num" style={{ fontSize: 13, color: 'var(--ink2)' }}>—</div>
                  <div><span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 12.5, fontWeight: 600, background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--ink2)' }}>Fixa</span></div>
                  <div className="num" style={{ fontSize: 15, fontWeight: 600, color: 'var(--neg)', textAlign: 'right' }}>{fmt(e.valorParcela)}</div>
                  <div />
                </div>
              );
            })}

            {/* Card invoices */}
            {cardFaturas.map(({ card, total: faturaTotal }) => {
              const key = `card-${card.id}-${cur.y}-${cur.m}`;
              const paid = !!payments[key];
              return (
                <div key={card.id} style={{
                  display: 'grid', gridTemplateColumns: ROW,
                  alignItems: 'center', gap: 12, padding: '14px 20px',
                  borderTop: '1px solid var(--border)',
                  opacity: paid ? 0.45 : 1, transition: 'opacity 0.2s',
                }}>
                  <PaidToggle paid={paid} onToggle={() => togglePaid(key)} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: card.grad, flexShrink: 0 }} />
                    <div style={{ fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: paid ? 'line-through' : 'none' }}>Fatura {card.name}</div>
                  </div>
                  <div><span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12.5, fontWeight: 600, background: '#3B82C422', color: '#3B82C4' }}>Cartão</span></div>
                  <div className="num" style={{ fontSize: 13, color: 'var(--ink2)' }}>dia {card.due}</div>
                  <div><span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 12.5, fontWeight: 600, background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--ink2)' }}>Fixa</span></div>
                  <div className="num" style={{ fontSize: 15, fontWeight: 600, color: 'var(--neg)', textAlign: 'right' }}>{fmt(faturaTotal)}</div>
                  <div />
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
