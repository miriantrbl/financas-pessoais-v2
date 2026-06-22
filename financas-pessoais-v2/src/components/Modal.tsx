import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../store';
import { MES_ABR, MES_FULL, parseMoney, CAT_PALETTE, uid, fmtShort } from '../utils';

const GRADIENTS = [
  'linear-gradient(135deg,#9b2fe0,#5b07a0)',
  'linear-gradient(135deg,#820ad1,#4a0578)',
  'linear-gradient(135deg,#7a17c9,#3a0a5e)',
  'linear-gradient(135deg,#ec7000,#a23b00)',
  'linear-gradient(135deg,#2563eb,#1e3a8a)',
  'linear-gradient(135deg,#0f766e,#134e4a)',
  'linear-gradient(135deg,#e11d48,#881337)',
  'linear-gradient(135deg,#3f3f46,#18181b)',
];

const INCOME_CATS = ['Salário', 'Freelance', 'Investimentos', 'Aluguel', 'Outros'];

function Overlay({ onClose }: { onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 60,
        background: 'rgba(15,14,10,.45)',
        backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    />
  );
}

function ModalCard({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <>
      <Overlay onClose={onClose} />
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'fixed', top: '50%', left: '50%', zIndex: 61,
          transform: 'translate(-50%, -50%)',
          background: 'var(--surface)',
          borderRadius: 18, padding: 28, width: '100%', maxWidth: 460,
          maxHeight: '90vh', overflowY: 'auto',
          boxShadow: '0 24px 64px rgba(0,0,0,.25)',
          animation: 'pop .15s ease',
        }}
      >
        {children}
      </div>
    </>
  );
}

function ModalHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
      <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{title}</h3>
      <button onClick={onClose} style={{ fontSize: 20, color: 'var(--ink3)', lineHeight: 1, padding: 4 }}>×</button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink2)', marginBottom: 5 }}>{label}</label>
      {children}
    </div>
  );
}

const inp: React.CSSProperties = {
  width: '100%', padding: '9px 12px', borderRadius: 10,
  border: '1px solid var(--border)', background: 'var(--surface2)',
  color: 'var(--ink)', fontSize: 14, outline: 'none',
};

function SubmitBtn({ label }: { label: string }) {
  return (
    <button type="submit" style={{
      width: '100%', padding: '11px', borderRadius: 10, marginTop: 6,
      background: 'var(--accent)', color: '#fff', fontWeight: 700, fontSize: 14,
    }}>{label}</button>
  );
}

// ── Nova Receita ──────────────────────────────────────────────
function ModalReceita() {
  const { closeModal, addIncome, cur } = useApp();
  const [form, setForm] = useState({ source: '', category: 'Salário', amount: '', date: `${cur.y}-${String(cur.m + 1).padStart(2,'0')}-01`, recurring: false });
  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(s => ({ ...s, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }));
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    addIncome({ source: form.source, category: form.category, amount: parseMoney(form.amount), date: form.date, recurring: form.recurring });
    closeModal();
  };
  return (
    <ModalCard onClose={closeModal}>
      <ModalHeader title="Nova receita" onClose={closeModal} />
      <form onSubmit={submit}>
        <Field label="Fonte"><input style={inp} value={form.source} onChange={f('source')} required placeholder="ex: Salário — Empresa" /></Field>
        <Field label="Categoria">
          <select style={inp} value={form.category} onChange={f('category')}>
            {INCOME_CATS.map(c => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Data"><input type="date" style={inp} value={form.date} onChange={f('date')} required /></Field>
        <Field label="Valor (R$)"><input style={inp} value={form.amount} onChange={f('amount')} required placeholder="0,00" /></Field>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, marginBottom: 16, cursor: 'pointer' }}>
          <input type="checkbox" checked={form.recurring} onChange={f('recurring')} />
          Recorrente (todo mês)
        </label>
        <SubmitBtn label="Salvar receita" />
      </form>
    </ModalCard>
  );
}

// ── Nova Despesa ──────────────────────────────────────────────
function ModalDespesa() {
  const { closeModal, addExpense, categories, cur, openModal } = useApp();
  const [form, setForm] = useState({ desc: '', category: categories[0]?.name || 'Outros', type: 'Variável' as 'Fixa' | 'Variável', amount: '', date: `${cur.y}-${String(cur.m + 1).padStart(2,'0')}-01` });
  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(s => ({ ...s, [k]: e.target.value }));
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense({ desc: form.desc, category: form.category, type: form.type, amount: parseMoney(form.amount), date: form.date });
    closeModal();
  };
  return (
    <ModalCard onClose={closeModal}>
      <ModalHeader title="Nova despesa" onClose={closeModal} />
      <form onSubmit={submit}>
        <Field label="Descrição"><input style={inp} value={form.desc} onChange={f('desc')} required placeholder="ex: Conta de luz" /></Field>
        <Field label="Categoria">
          <select style={inp} value={form.category} onChange={f('category')}>
            {categories.map(c => <option key={c.name}>{c.name}</option>)}
          </select>
        </Field>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <Field label="Tipo">
              <select style={inp} value={form.type} onChange={f('type')}>
                <option>Variável</option>
                <option>Fixa</option>
              </select>
            </Field>
          </div>
          <div style={{ flex: 1 }}>
            <Field label="Data"><input type="date" style={inp} value={form.date} onChange={f('date')} required /></Field>
          </div>
        </div>
        <Field label="Valor (R$)"><input style={inp} value={form.amount} onChange={f('amount')} required placeholder="0,00" /></Field>
        <SubmitBtn label="Salvar despesa" />
      </form>
    </ModalCard>
  );
}

// ── Novo Cartão ──────────────────────────────────────────────
function ModalCartao() {
  const { closeModal, addCard } = useApp();
  const [form, setForm] = useState({ name: '', issuer: '', last4: '', grad: GRADIENTS[0], limit: '', closing: '', due: '' });
  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(s => ({ ...s, [k]: e.target.value }));
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    addCard({ name: form.name, issuer: form.issuer, last4: form.last4, grad: form.grad, limit: parseMoney(form.limit), closing: parseInt(form.closing), due: parseInt(form.due) });
    closeModal();
  };
  return (
    <ModalCard onClose={closeModal}>
      <ModalHeader title="Novo cartão" onClose={closeModal} />
      <form onSubmit={submit}>
        <Field label="Nome do cartão"><input style={inp} value={form.name} onChange={f('name')} required placeholder="ex: Nubank Pessoal" /></Field>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}><Field label="Banco/Bandeira"><input style={inp} value={form.issuer} onChange={f('issuer')} required placeholder="Nubank" /></Field></div>
          <div style={{ flex: 1 }}><Field label="4 últimos dígitos"><input style={inp} value={form.last4} onChange={f('last4')} required maxLength={4} placeholder="0000" /></Field></div>
        </div>
        <Field label="Cor do cartão">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {GRADIENTS.map(g => (
              <div
                key={g}
                onClick={() => setForm(s => ({ ...s, grad: g }))}
                style={{
                  width: 36, height: 36, borderRadius: 8, background: g, cursor: 'pointer',
                  outline: form.grad === g ? '2.5px solid var(--accent)' : '2.5px solid transparent',
                  outlineOffset: 2,
                }}
              />
            ))}
          </div>
        </Field>
        <Field label="Limite (R$)"><input style={inp} value={form.limit} onChange={f('limit')} required placeholder="0,00" /></Field>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}><Field label="Dia fechamento"><input type="number" style={inp} value={form.closing} onChange={f('closing')} required min={1} max={31} /></Field></div>
          <div style={{ flex: 1 }}><Field label="Dia vencimento"><input type="number" style={inp} value={form.due} onChange={f('due')} required min={1} max={31} /></Field></div>
        </div>
        <SubmitBtn label="Salvar cartão" />
      </form>
    </ModalCard>
  );
}

// ── Nova Compra ──────────────────────────────────────────────
function ModalCompra({ cardId }: { cardId: string }) {
  const { closeModal, addPurchase, categories, cur } = useApp();
  const [form, setForm] = useState({ desc: '', category: categories[0]?.name || 'Outros', total: '', parc: false, installments: '1' });
  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(s => ({ ...s, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }));

  const total = parseMoney(form.total);
  const inst = Math.max(1, parseInt(form.installments) || 1);
  const valorParcela = total / inst;
  const lastIdx = cur.m + inst - 1;
  const ultimoMes = MES_ABR[lastIdx % 12] + '/' + (cur.y + Math.floor(lastIdx / 12));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    addPurchase({ cardId, desc: form.desc, category: form.category, total, installments: inst, startY: cur.y, startM: cur.m, parc: form.parc });
    closeModal();
  };
  return (
    <ModalCard onClose={closeModal}>
      <ModalHeader title="Nova compra" onClose={closeModal} />
      <form onSubmit={submit}>
        <Field label="Descrição"><input style={inp} value={form.desc} onChange={f('desc')} required placeholder="ex: iPhone 15 Pro" /></Field>
        <Field label="Categoria">
          <select style={inp} value={form.category} onChange={f('category')}>
            {categories.map(c => <option key={c.name}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="Valor total (R$)"><input style={inp} value={form.total} onChange={f('total')} required placeholder="0,00" /></Field>

        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {['À vista', 'Parcelado'].map(v => (
            <button
              key={v}
              type="button"
              onClick={() => setForm(s => ({ ...s, parc: v === 'Parcelado', installments: v === 'Parcelado' ? s.installments : '1' }))}
              style={{
                flex: 1, padding: '8px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                background: (v === 'Parcelado') === form.parc ? 'var(--accent)' : 'var(--surface2)',
                color: (v === 'Parcelado') === form.parc ? '#fff' : 'var(--ink2)',
                border: '1px solid var(--border)',
              }}
            >{v}</button>
          ))}
        </div>

        {form.parc && (
          <Field label="Quantidade de parcelas">
            <input type="number" style={inp} value={form.installments} onChange={f('installments')} min={2} max={48} />
          </Field>
        )}

        {total > 0 && (
          <div style={{ background: 'var(--surface2)', borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: 'var(--ink3)', marginBottom: 4 }}>Na fatura aparece</div>
            <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 18, color: 'var(--accent)' }}>
              {fmtShort(valorParcela)}
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink2)', marginTop: 2 }}>
              {form.parc ? `por mês · ${inst}x · última parcela em ${ultimoMes}` : 'pagamento à vista'} · total {fmtShort(total)}
            </div>
          </div>
        )}
        <SubmitBtn label="Salvar compra" />
      </form>
    </ModalCard>
  );
}

// ── Nova Categoria ────────────────────────────────────────────
function ModalCategoria() {
  const { closeModal, addCategory } = useApp();
  const [form, setForm] = useState({ name: '', color: CAT_PALETTE[0] });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    addCategory({ name: form.name, color: form.color });
    closeModal();
  };
  return (
    <ModalCard onClose={closeModal}>
      <ModalHeader title="Nova categoria" onClose={closeModal} />
      <form onSubmit={submit}>
        <Field label="Nome"><input style={inp} value={form.name} onChange={e => setForm(s => ({ ...s, name: e.target.value }))} required /></Field>
        <Field label="Cor">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CAT_PALETTE.map(c => (
              <div
                key={c}
                onClick={() => setForm(s => ({ ...s, color: c }))}
                style={{
                  width: 32, height: 32, borderRadius: '50%', background: c, cursor: 'pointer',
                  outline: form.color === c ? '2.5px solid var(--ink)' : 'none', outlineOffset: 2,
                }}
              />
            ))}
          </div>
        </Field>
        <SubmitBtn label="Salvar categoria" />
      </form>
    </ModalCard>
  );
}

// ── Depositar ─────────────────────────────────────────────────
function ModalDepositar({ metaId }: { metaId: string }) {
  const { closeModal, deposit, savings } = useApp();
  const meta = savings.find(m => m.id === metaId);
  const [amount, setAmount] = useState('');
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    deposit(metaId, parseMoney(amount));
    closeModal();
  };
  return (
    <ModalCard onClose={closeModal}>
      <ModalHeader title={`Depositar em "${meta?.name}"`} onClose={closeModal} />
      <form onSubmit={submit}>
        <Field label="Valor (R$)"><input style={inp} value={amount} onChange={e => setAmount(e.target.value)} required placeholder="0,00" autoFocus /></Field>
        <SubmitBtn label="Depositar" />
      </form>
    </ModalCard>
  );
}

// ── Nova Meta ─────────────────────────────────────────────────
function ModalMeta() {
  const { closeModal, addMeta } = useApp();
  const [form, setForm] = useState({ name: '', target: '', current: '', monthly: '', color: CAT_PALETTE[0] });
  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(s => ({ ...s, [k]: e.target.value }));
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    addMeta({ name: form.name, target: parseMoney(form.target), current: parseMoney(form.current), monthly: parseMoney(form.monthly), color: form.color });
    closeModal();
  };
  return (
    <ModalCard onClose={closeModal}>
      <ModalHeader title="Nova meta de poupança" onClose={closeModal} />
      <form onSubmit={submit}>
        <Field label="Nome da meta"><input style={inp} value={form.name} onChange={f('name')} required placeholder="ex: Viagem Europa" /></Field>
        <Field label="Valor da meta (R$)"><input style={inp} value={form.target} onChange={f('target')} required placeholder="0,00" /></Field>
        <Field label="Já guardado (R$)"><input style={inp} value={form.current} onChange={f('current')} placeholder="0,00" /></Field>
        <Field label="Aporte mensal (R$)"><input style={inp} value={form.monthly} onChange={f('monthly')} placeholder="0,00" /></Field>
        <Field label="Cor">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CAT_PALETTE.map(c => (
              <div key={c} onClick={() => setForm(s => ({ ...s, color: c }))}
                style={{ width: 32, height: 32, borderRadius: '50%', background: c, cursor: 'pointer', outline: form.color === c ? '2.5px solid var(--ink)' : 'none', outlineOffset: 2 }} />
            ))}
          </div>
        </Field>
        <SubmitBtn label="Criar meta" />
      </form>
    </ModalCard>
  );
}

export default function Modal() {
  const { modal, closeModal } = useApp();
  if (!modal) return null;

  switch (modal.type) {
    case 'receita': return <ModalReceita />;
    case 'despesa': return <ModalDespesa />;
    case 'cartao': return <ModalCartao />;
    case 'compra': return <ModalCompra cardId={modal.cardId} />;
    case 'categoria': return <ModalCategoria />;
    case 'depositar': return <ModalDepositar metaId={modal.metaId} />;
    case 'meta': return <ModalMeta />;
    default: return null;
  }
}
