import React, { useMemo } from 'react';
import { useApp } from '../store';
import { MES_ABR, MES_FULL, fmt, fmtDate, installmentInfo, installmentLabel } from '../utils';

function catColor(name: string, categories: { name: string; color: string }[]) {
  return categories.find(c => c.name === name)?.color || '#8A867E';
}

export default function Cartoes() {
  const { cur, cards, purchases, selectedCard, setSelectedCard, openModal, removePurchase, categories } = useApp();

  const cardFaturas = useMemo(() => {
    return cards.map(card => {
      const items = purchases.filter(p => {
        if (p.cardId !== card.id) return false;
        const { included } = installmentInfo(p, cur.y, cur.m);
        return included;
      });
      const total = items.reduce((s, p) => s + installmentInfo(p, cur.y, cur.m).valorParcela, 0);
      const used = purchases.filter(p => p.cardId === card.id).reduce((s, p) => {
        // Total spent (sum of remaining installment values)
        return s + p.total;
      }, 0);
      return { card, items, total, used: Math.min(used, card.limit) };
    });
  }, [cards, purchases, cur]);

  const active = selectedCard || cards[0]?.id;
  const activeFatura = cardFaturas.find(f => f.card.id === active);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 23, fontWeight: 800, letterSpacing: '-0.02em' }}>Cartões</h1>
          <div style={{ fontSize: 13, color: 'var(--ink2)', marginTop: 2 }}>Fatura de {MES_FULL[cur.m]} {cur.y} · valor por parcela</div>
        </div>
        <button
          onClick={() => openModal({ type: 'cartao' })}
          style={{ padding: '10px 18px', borderRadius: 10, background: 'var(--accent)', color: '#fff', fontWeight: 700, fontSize: 14 }}
        >+ Novo cartão</button>
      </div>

      {/* Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(230px,1fr))', gap: 14, marginBottom: 20 }}>
        {cardFaturas.map(({ card, total, used }) => {
          const isActive = (selectedCard || cards[0]?.id) === card.id;
          const usedPct = card.limit > 0 ? Math.min(100, used / card.limit * 100) : 0;
          return (
            <button
              key={card.id}
              onClick={() => setSelectedCard(card.id)}
              style={{
                background: card.grad, borderRadius: 16, padding: 18, textAlign: 'left',
                color: '#fff', position: 'relative', overflow: 'hidden',
                outline: isActive ? '2.5px solid var(--accent)' : 'none',
                outlineOffset: 3,
                boxShadow: isActive ? '0 8px 24px rgba(0,0,0,.25)' : 'var(--shadow)',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ position: 'absolute', right: -20, top: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{card.name}</div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>{card.issuer}</div>
              </div>
              <div className="num" style={{ fontSize: 13, opacity: 0.75, letterSpacing: '0.15em', marginBottom: 12 }}>•••• {card.last4}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 11, opacity: 0.7 }}>fatura {MES_ABR[cur.m]}</div>
                  <div className="num" style={{ fontSize: 19, fontWeight: 600 }}>{fmt(total)}</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: 11.5, opacity: 0.75, whiteSpace: 'nowrap' }}>
                  fecha dia {card.closing}<br />vence dia {card.due}
                </div>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.25)', borderRadius: 2, marginBottom: 4 }}>
                <div style={{ height: '100%', width: usedPct + '%', background: '#fff', borderRadius: 2 }} />
              </div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>
                limite usado · {fmt(used)} de {fmt(card.limit)}
              </div>
            </button>
          );
        })}
      </div>

      {/* Invoice panel */}
      {activeFatura && (
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: activeFatura.card.grad }} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>Fatura · {activeFatura.card.name}</div>
                <div style={{ fontSize: 12.5, color: 'var(--ink3)' }}>
                  {MES_FULL[cur.m]} {cur.y} · fecha dia {activeFatura.card.closing} · vence dia {activeFatura.card.due}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, color: 'var(--ink3)' }}>total da fatura</div>
                <div className="num" style={{ fontSize: 22, fontWeight: 600 }}>{fmt(activeFatura.total)}</div>
              </div>
              <button
                onClick={() => openModal({ type: 'compra', cardId: activeFatura.card.id })}
                style={{ padding: '9px 16px', borderRadius: 10, background: 'var(--accent)', color: '#fff', fontWeight: 700, fontSize: 13 }}
              >+ Compra</button>
            </div>
          </div>

          {activeFatura.items.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: 'var(--ink3)', fontSize: 14 }}>
              Nenhuma compra na fatura de {MES_FULL[cur.m]}
            </div>
          ) : (
            activeFatura.items.map((p, i) => {
              const { valorParcela, parcelaAtual } = installmentInfo(p, cur.y, cur.m);
              const color = catColor(p.category, categories);
              const label = installmentLabel(p, cur.y, cur.m);
              return (
                <div key={p.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px',
                  borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: color + '22', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 16, height: 16, borderRadius: 4, background: color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 14.5, fontWeight: 600 }}>{p.desc}</span>
                      {p.parc ? (
                        <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 11.5, fontWeight: 600, background: '#8B5CF622', color: '#8B5CF6' }}>
                          {parcelaAtual}/{p.installments}
                        </span>
                      ) : (
                        <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 11.5, fontWeight: 600, background: 'var(--accent)22', color: 'var(--accent)' }}>
                          à vista
                        </span>
                      )}
                      <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11.5, fontWeight: 600, background: color + '22', color }}>{p.category}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--ink3)' }}>{label}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div className="num" style={{ fontSize: 16, fontWeight: 600 }}>{fmt(valorParcela)}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink3)' }}>total {fmt(p.total)}</div>
                  </div>
                  <button onClick={() => removePurchase(p.id)} style={{ color: 'var(--ink3)', fontSize: 16, lineHeight: 1, padding: 4 }}>×</button>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
