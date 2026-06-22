import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { collection, onSnapshot, deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { Receita, Despesa, Cartao, CompraCartao, Meta, Categoria, Emprestimo, Tab, Theme, HomeVariant, ModalType } from '../types';
import { uid } from '../utils';

interface AppState {
  theme: Theme;
  activeTab: Tab;
  homeVariant: HomeVariant;
  cur: { y: number; m: number };
  filterCat: string;
  selectedCard: string | null;
  modal: ModalType;
  incomes: Receita[];
  expenses: Despesa[];
  categories: Categoria[];
  cards: Cartao[];
  purchases: CompraCartao[];
  savings: Meta[];
  emprestimos: Emprestimo[];
  loaded: boolean;
}

interface AppActions {
  setTheme: (t: Theme) => void;
  setTab: (t: Tab) => void;
  setHomeVariant: (v: HomeVariant) => void;
  setCur: (cur: { y: number; m: number }) => void;
  prevMonth: () => void;
  nextMonth: () => void;
  setFilterCat: (c: string) => void;
  setSelectedCard: (id: string | null) => void;
  openModal: (m: ModalType) => void;
  closeModal: () => void;
  addIncome: (r: Omit<Receita, 'id'>) => void;
  removeIncome: (id: string) => void;
  addExpense: (e: Omit<Despesa, 'id'>) => void;
  removeExpense: (id: string) => void;
  addCategory: (c: Omit<Categoria, 'id'>) => void;
  addCard: (c: Omit<Cartao, 'id'>) => void;
  addPurchase: (p: Omit<CompraCartao, 'id'>) => void;
  removePurchase: (id: string) => void;
  addMeta: (m: Omit<Meta, 'id'>) => void;
  updateMeta: (id: string, m: Omit<Meta, 'id'>) => void;
  removeMeta: (id: string) => void;
  deposit: (metaId: string, amount: number) => void;
  addEmprestimo: (e: Omit<Emprestimo, 'id'>) => void;
  removeEmprestimo: (id: string) => void;
}

const Ctx = createContext<(AppState & AppActions) | null>(null);

function load<T>(key: string, def: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : def;
  } catch { return def; }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => ({
    theme: load('theme', 'light') as Theme,
    activeTab: 'inicio',
    homeVariant: 'B',
    cur: { y: 2026, m: 5 },
    filterCat: 'Todas',
    selectedCard: null,
    modal: null,
    incomes: [],
    expenses: [],
    categories: [],
    cards: [],
    purchases: [],
    savings: [],
    emprestimos: [],
    loaded: false,
  }));

  // Listen to Firestore collections
  useEffect(() => {
    const unsubs = [
      onSnapshot(collection(db, 'incomes'), snap => {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Receita[];
        setState(s => ({ ...s, incomes: items }));
      }),
      onSnapshot(collection(db, 'expenses'), snap => {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Despesa[];
        setState(s => ({ ...s, expenses: items }));
      }),
      onSnapshot(collection(db, 'categories'), snap => {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as unknown)) as Categoria[];
        setState(s => ({ ...s, categories: items, loaded: true }));
      }),
      onSnapshot(collection(db, 'cards'), snap => {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Cartao[];
        setState(s => ({ ...s, cards: items }));
      }),
      onSnapshot(collection(db, 'purchases'), snap => {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() })) as CompraCartao[];
        setState(s => ({ ...s, purchases: items }));
      }),
      onSnapshot(collection(db, 'savings'), snap => {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Meta[];
        setState(s => ({ ...s, savings: items }));
      }),
      onSnapshot(collection(db, 'emprestimos'), snap => {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Emprestimo[];
        setState(s => ({ ...s, emprestimos: items }));
      }),
    ];
    return () => unsubs.forEach(u => u());
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(state.theme));
  }, [state.theme]);

  const set = useCallback((patch: Partial<AppState>) => setState(s => ({ ...s, ...patch })), []);

  const actions: AppActions = {
    setTheme: t => set({ theme: t }),
    setTab: t => set({ activeTab: t }),
    setHomeVariant: v => set({ homeVariant: v }),
    setCur: cur => set({ cur }),
    prevMonth: () => setState(s => {
      const m = s.cur.m === 0 ? 11 : s.cur.m - 1;
      const y = s.cur.m === 0 ? s.cur.y - 1 : s.cur.y;
      return { ...s, cur: { y, m } };
    }),
    nextMonth: () => setState(s => {
      const m = s.cur.m === 11 ? 0 : s.cur.m + 1;
      const y = s.cur.m === 11 ? s.cur.y + 1 : s.cur.y;
      return { ...s, cur: { y, m } };
    }),
    setFilterCat: c => set({ filterCat: c }),
    setSelectedCard: id => set({ selectedCard: id }),
    openModal: m => set({ modal: m }),
    closeModal: () => set({ modal: null }),
    addIncome: r => { const id = uid(); setDoc(doc(db, 'incomes', id), r); },
    removeIncome: id => deleteDoc(doc(db, 'incomes', id)),
    addExpense: e => { const id = uid(); setDoc(doc(db, 'expenses', id), e); },
    removeExpense: id => deleteDoc(doc(db, 'expenses', id)),
    addCategory: c => { const id = uid(); setDoc(doc(db, 'categories', id), c); },
    addCard: c => { const id = uid(); setDoc(doc(db, 'cards', id), c); },
    addPurchase: p => { const id = uid(); setDoc(doc(db, 'purchases', id), p); },
    removePurchase: id => deleteDoc(doc(db, 'purchases', id)),
    addMeta: m => { const id = uid(); setDoc(doc(db, 'savings', id), m); },
    updateMeta: (id, m) => updateDoc(doc(db, 'savings', id), { ...m }),
    removeMeta: id => deleteDoc(doc(db, 'savings', id)),
    deposit: (metaId, amount) => {
      const meta = state.savings.find(m => m.id === metaId);
      if (meta) updateDoc(doc(db, 'savings', metaId), { current: meta.current + amount });
    },
    addEmprestimo: e => { const id = uid(); setDoc(doc(db, 'emprestimos', id), e); },
    removeEmprestimo: id => deleteDoc(doc(db, 'emprestimos', id)),
  };

  if (!state.loaded) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#F4F3EF', fontFamily: 'Hanken Grotesk, sans-serif',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#1F7A5C', marginBottom: 8 }}>saldo</div>
          <div style={{ fontSize: 14, color: '#6E6A62' }}>carregando...</div>
        </div>
      </div>
    );
  }

  return <Ctx.Provider value={{ ...state, ...actions }}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp outside provider');
  return ctx;
}
