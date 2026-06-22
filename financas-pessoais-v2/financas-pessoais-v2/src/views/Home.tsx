import React, { useMemo } from 'react';
import { useApp } from '../store';
import { MES_ABR, MES_FULL, fmt, fmtSigned, fmtShort, installmentInfo, TODAY } from '../utils';
import { LineChart, Line, Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';

function catColor(name: string, categories: { name: string; color: string }[]) {
  return categories.find(c => c.name === name)?.color || '#8A867E';
}

export default function Home() {
  const { homeVariant, setHomeVariant, cur, incomes, expenses, cards, purchases, savings, categories } = useApp();

  // Month stats
  const monthIncomes = incomes.filter(r => {
    const [y, m] = r.date.split('-').map(Number);
    return y === cur.y && m - 1 === cur.m;
  });
  const monthExpenses = expenses.filter(e => {
    const [y, m] = e.date.split('-').map(Number);
    return y === cur.y && m - 1 === cur.m;
  });
  const monthCardTotal = useMemo(() => {
    let sum = 0;
    for (const p of purchases) {
      const { included, valorParcela } = installmentInfo(p, cur.y, cur.m);
      if (included) sum += valorParcela;
    }
    return sum;
  }, [purchases, cur]);

  const totalInc = monthIncomes.reduce((s, r) => s + r.amount, 0);
  const totalExp = monthExpenses.reduce((s, e) => s + e.amount, 0) + monthCardTotal;
  const saldoMes = totalInc - totalExp;
  const totalGuardado = savings.reduce((s, m) => s + m.current, 0);

  // Annual data (Jan to current month)
  const annualData = useMemo(() => {
    const data = [];
    let accumulated = 0;
    for (let m = 0; m <= cur.m && cur.y === 2026; m++) {
      const inc = incomes.filter(r => { const [y, mo] = r.date.split('-').map(Number); return y === cur.y && mo - 1 === m; }).reduce((s, r) => s + r.amount, 0);
      const exp = expenses.filter(e => { const [y, mo] = e.date.split('-').map(Number); return y === cur.y && mo - 1 === m; }).reduce((s, e) => s + e.amount, 0);
      let cardExp = 0;
      for (const p of purchases) {
        const { included, valorParcela } = installmentInfo(p, cur.y, m);
        if (included) cardExp += valorParcela;
      }
      accumulated += inc - exp - cardExp;
      data.push({ month: MES_ABR[m], saldo: Math.round(accumulated) });
    }
    return data;
  }, [incomes, expenses, purchases, cur]);

  const totalAnnualInc = useMemo(() => {
    let sum = 0;
    for (let m = 0; m <= cur.m; m++) {
      sum += incomes.filter(r => { const [y, mo] = r.date.split('-').map(Number); return y === cur.y && mo - 1 === m; }).reduce((s, r) => s + r.amount, 0);
    }
    return sum;
  }, [incomes, cur]);

  const totalAnnualExp = useMemo(() => {
    let sum = 0;
    for (let m = 0; m <= cur.m; m++) {
      const exp = expenses.filter(e => { const [y, mo] = e.date.split('-').map(Number); return y === cur.y && mo - 1 === m; }).reduce((s, e) => s + e.amount, 0);
      let cardExp = 0;
      for (const p of purchases) {
        const { included, valorParcela } = installmentInfo(p, cur.y, m);
        if (included) cardExp += valorParcela;
      }
      sum += exp + cardExp;
    }
    return sum;
  }, [expenses, purchases, cur]);

  const saldoAnual = annualData[annualData.length - 1]?.saldo || 0;
  const taxaPoupanca = totalAnnualInc > 0 ? Math.round((totalAnnualInc - totalAnnualExp) / totalAnnualInc * 100) : 0;

  // Category breakdown
  const catBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    for (const e of monthExpenses) {
      map[e.category] = (map[e.category] || 0) + e.amount;
    }
    for (const p of purchases) {
      const { included, valorParcela } = installmentInfo(p, cur.y, cur.m);
      if (included) map[p.category] = (map[p.category] || 0) + valorParcela;
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [monthExpenses, purchases, cur]);

  const catTotal = catBreakdown.reduce((s, [, v]) => s + v, 0);

  // Next invoices
  const nextInvoices = useMemo(() => {
    return cards.map(card => {
      const fatura = purchases
        .filter(p => p.cardId === card.id)
        .reduce((s, p) => {
          const { included, valorParcela } = installmentInfo(p, cur.y, cur.m);
          return s + (included ? valorParcela : 0);
        }, 0);
      // Days until due
      const dueDate = new Date(cur.y, cur.m, card.due);
      const today = new Date(TODAY.y, TODAY.m, TODAY.d);
      const diffMs = dueDate.getTime() - today.getTime();
      const diffDays = Math.round(diffMs / 86400000);
      return { card, fatura, diffDays };
    }).sort((a, b) => a.diffDays - b.diffDays);
  }, [cards, purchases, cur]);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 23, fontWeight: 800, letterSpacing: '-0.02em' }}>Visão geral</h1>
          <div style={{ fontSize: 13, color: 'var(--ink2)', marginTop: 2 }}>
            Resumo de {MES_FULL[cur.m]} {cur.y} e balanço do ano
          </div>
        </div>
        <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
          {(['A', 'B'] as const).map(v => (
            <button
              key={v}
              onClick={() => setHomeVariant(v)}
              style={{
                padding: '7px 16px', fontSize: 13, fontWeight: 600,
                background: homeVariant === v ? 'var(--accent)' : 'transparent',
                color: homeVariant === v ? '#fff' : 'var(--ink2)',
              }}
            >Layout {v}</button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 14, marginBottom: 14 }}>
        <StatCard label="Receitas do mês" value={totalInc} color="var(--pos)" sub={MES_FULL[cur.m]} dotColor="var(--pos)" />
        <StatCard label="Despesas do mês" value={totalExp} color="var(--neg)" sub="inclui faturas de cartão" dotColor="var(--neg)" />
        <StatCard label="Saldo do mês" value={saldoMes} color={saldoMes >= 0 ? 'var(--pos)' : 'var(--neg)'} sub={saldoMes >= 0 ? 'sobrou este mês' : 'no vermelho'} dotColor={saldoMes >= 0 ? 'var(--pos)' : 'var(--neg)'} signed />
        <StatCard label="Guardado" value={totalGuardado} color="var(--gold)" sub="total em poupança" dotColor="var(--gold)" />
      </div>

      {homeVariant === 'B' ? (
        <LayoutB
          saldoAnual={saldoAnual}
          totalAnnualInc={totalAnnualInc}
          totalAnnualExp={totalAnnualExp}
          taxaPoupanca={taxaPoupanca}
          annualData={annualData}
          catBreakdown={catBreakdown}
          catTotal={catTotal}
          nextInvoices={nextInvoices}
          savings={savings}
          categories={categories}
        />
      ) : (
        <LayoutA
          annualData={annualData}
          catBreakdown={catBreakdown}
          catTotal={catTotal}
          nextInvoices={nextInvoices}
          savings={savings}
          categories={categories}
          incomes={incomes}
          expenses={expenses}
          purchases={purchases}
          cur={cur}
        />
      )}
    </div>
  );
}

function StatCard({ label, value, color, sub, dotColor, signed }: {
  label: string; value: number; color: string; sub: string; dotColor: string; signed?: boolean;
}) {
  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--ink2)', marginBottom: 8 }}>
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: dotColor, display: 'inline-block', flexShrink: 0 }} />
        {label}
      </div>
      <div className="num" style={{ fontSize: 26, fontWeight: 600, color, letterSpacing: '-0.01em', lineHeight: 1.1 }}>
        {signed ? fmtSigned(value) : fmt(value)}
      </div>
      <div style={{ fontSize: 12.5, color: 'var(--ink3)', marginTop: 5 }}>{sub}</div>
    </div>
  );
}

// ── Layout B ─────────────────────────────────────────────────
function LayoutB({ saldoAnual, totalAnnualInc, totalAnnualExp, taxaPoupanca, annualData, catBreakdown, catTotal, nextInvoices, savings, categories }: any) {
  return (
    <>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))',
        borderRadius: 18, padding: '26px 26px', marginBottom: 14,
        display: 'flex', alignItems: 'center', gap: 20, position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circle */}
        <div style={{ position: 'absolute', right: -40, top: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ position: 'absolute', right: 160, bottom: -60, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Saldo acumulado do ano</div>
          <div className="num" style={{ fontSize: 42, fontWeight: 600, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            {fmtSigned(saldoAnual)}
          </div>
          <div style={{ display: 'flex', gap: 24, marginTop: 14, flexWrap: 'wrap' }}>
            {[
              { label: 'Receitas · ano', value: fmtShort(totalAnnualInc) },
              { label: 'Despesas · ano', value: fmtShort(totalAnnualExp) },
              { label: 'Taxa de poupança', value: taxaPoupanca + '%' },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12 }}>{label}</div>
                <div className="num" style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mini chart */}
        {annualData.length > 1 && (
          <div style={{ width: 200, height: 90, flexShrink: 0, position: 'relative', zIndex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={annualData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <defs>
                  <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fff" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#fff" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="saldo" stroke="#fff" strokeWidth={2.5} fill="url(#heroGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Grid 2 cols */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <DonutChart catBreakdown={catBreakdown} catTotal={catTotal} categories={categories} />
        <NextInvoices nextInvoices={nextInvoices} />
      </div>

      <SavingsGoals savings={savings} />
    </>
  );
}

// ── Layout A ─────────────────────────────────────────────────
function LayoutA({ annualData, catBreakdown, catTotal, nextInvoices, savings, categories, incomes, expenses, purchases, cur }: any) {
  // Last 6 months bar data
  const barData = useMemo(() => {
    const data = [];
    for (let i = 5; i >= 0; i--) {
      let m = cur.m - i;
      let y = cur.y;
      if (m < 0) { m += 12; y -= 1; }
      const inc = incomes.filter((r: any) => { const [ry, rm] = r.date.split('-').map(Number); return ry === y && rm - 1 === m; }).reduce((s: number, r: any) => s + r.amount, 0);
      const exp = expenses.filter((e: any) => { const [ey, em] = e.date.split('-').map(Number); return ey === y && em - 1 === m; }).reduce((s: number, e: any) => s + e.amount, 0);
      let cardExp = 0;
      for (const p of purchases) {
        const { included, valorParcela } = installmentInfo(p, y, m);
        if (included) cardExp += valorParcela;
      }
      data.push({ month: MES_ABR[m], inc, exp: exp + cardExp });
    }
    return data;
  }, [incomes, expenses, purchases, cur]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.55fr 1fr', gap: 14 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <BarChartCard barData={barData} />
        <LineChartCard annualData={annualData} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <DonutChart catBreakdown={catBreakdown} catTotal={catTotal} categories={categories} />
        <NextInvoices nextInvoices={nextInvoices} />
        <SavingsGoals savings={savings} />
      </div>
    </div>
  );
}

function BarChartCard({ barData }: { barData: any[] }) {
  const max = Math.max(...barData.map(d => Math.max(d.inc, d.exp)), 1);
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700 }}>Receitas vs Despesas</div>
        <div style={{ display: 'flex', gap: 12, fontSize: 12 }}>
          <span style={{ color: 'var(--pos)' }}>● Receitas</span>
          <span style={{ color: 'var(--neg)' }}>● Despesas</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', height: 120 }}>
        {barData.map(d => (
          <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 100 }}>
              <div style={{ width: 14, height: Math.max(4, d.inc / max * 100), background: 'var(--pos)', borderRadius: '5px 5px 0 0' }} />
              <div style={{ width: 14, height: Math.max(4, d.exp / max * 100), background: 'var(--neg)', borderRadius: '5px 5px 0 0' }} />
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink3)' }}>{d.month}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LineChartCard({ annualData }: { annualData: any[] }) {
  return (
    <div className="card">
      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Evolução do saldo · 2026</div>
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart data={annualData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.2} />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <Tooltip
            contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }}
            formatter={(v: any) => [fmtShort(v), 'Saldo']}
          />
          <Area type="monotone" dataKey="saldo" stroke="var(--accent)" strokeWidth={2.5} fill="url(#lineGrad)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Donut Chart ───────────────────────────────────────────────
function DonutChart({ catBreakdown, catTotal, categories }: { catBreakdown: [string, number][]; catTotal: number; categories: any[] }) {
  const R = 46, SW = 17;
  const cx = 70, cy = 70;
  const circum = 2 * Math.PI * R;
  let offset = 0;

  return (
    <div className="card">
      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Despesas por categoria</div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <svg width={140} height={140} style={{ flexShrink: 0 }}>
          <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--surface2)" strokeWidth={SW} />
          {catBreakdown.map(([cat, val]) => {
            const pct = catTotal > 0 ? val / catTotal : 0;
            const dash = pct * circum;
            const seg = (
              <circle
                key={cat}
                cx={cx} cy={cy} r={R}
                fill="none"
                stroke={catColor(cat, categories)}
                strokeWidth={SW}
                strokeDasharray={`${dash} ${circum - dash}`}
                strokeDashoffset={circum / 4 - offset}
                strokeLinecap="round"
              />
            );
            offset += dash;
            return seg;
          })}
          <text x={cx} y={cy - 6} textAnchor="middle" fontSize={10} fill="var(--ink3)" fontFamily="Hanken Grotesk">total</text>
          <text x={cx} y={cy + 10} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--ink)" fontFamily="Space Grotesk">{fmtShort(catTotal)}</text>
        </svg>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {catBreakdown.map(([cat, val]) => (
            <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: catColor(cat, categories), flexShrink: 0 }} />
              <span style={{ flex: 1, color: 'var(--ink2)' }}>{cat}</span>
              <span className="num" style={{ color: 'var(--ink)', fontWeight: 500 }}>{fmtShort(val)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Next Invoices ─────────────────────────────────────────────
function NextInvoices({ nextInvoices }: { nextInvoices: any[] }) {
  const todayStr = `hoje · ${TODAY.d} ${MES_ABR[TODAY.m]}`;
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontSize: 15, fontWeight: 700 }}>Próximas faturas</div>
        <div style={{ fontSize: 11.5, color: 'var(--ink3)' }}>{todayStr}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {nextInvoices.filter(i => i.fatura > 0).map(({ card, fatura, diffDays }) => {
          const urgency = diffDays < 0 ? 'var(--neg)' : diffDays <= 5 ? 'var(--gold)' : 'var(--ink3)';
          const dueText = diffDays < 0 ? 'vencida' : diffDays === 0 ? 'vence hoje' : `vence em ${diffDays} dias`;
          return (
            <div key={card.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: card.grad, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.2 }}>{card.name}</div>
                <div style={{ fontSize: 12, color: urgency }}>{dueText}</div>
              </div>
              <div className="num" style={{ fontSize: 14, fontWeight: 600, flexShrink: 0 }}>{fmt(fatura)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Savings Goals ─────────────────────────────────────────────
function SavingsGoals({ savings }: { savings: any[] }) {
  return (
    <div className="card">
      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Metas de poupança</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {savings.map(m => {
          const pct = m.target > 0 ? Math.min(100, m.current / m.target * 100) : 0;
          return (
            <div key={m.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13.5, fontWeight: 600 }}>{m.name}</span>
                <span style={{ fontSize: 12.5, color: 'var(--ink3)' }}>{Math.round(pct)}% concluído</span>
              </div>
              <div style={{ height: 7, background: 'var(--surface2)', borderRadius: 4, overflow: 'hidden', marginBottom: 4 }}>
                <div style={{ height: '100%', width: pct + '%', background: m.color, borderRadius: 4, transition: 'width 0.4s' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="num" style={{ fontSize: 12, color: m.color, fontWeight: 600 }}>{fmt(m.current)}</span>
                <span className="num" style={{ fontSize: 12, color: 'var(--ink3)' }}>{fmt(m.target)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
