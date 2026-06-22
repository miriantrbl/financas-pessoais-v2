import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Receita, Despesa, Cartao, CompraCartao, Meta, Categoria, Tab, Theme, HomeVariant, ModalType } from '../types';
import { defaultIncomes, defaultExpenses, defaultCards, defaultPurchases, defaultSavings, defaultCategories } from './data';
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
  deposit: (metaId: string, amount: number) => void;
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
    incomes: load('incomes', defaultIncomes),
    expenses: load('expenses', defaultExpenses),
    categories: load('categories', defaultCategories),
    cards: load('cards', defaultCards),
    purchases: load('purchases', defaultPurchases),
    savings: load('savings', defaultSavings),
  }));

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(state.theme));
  }, [state.theme]);

  useEffect(() => {
    localStorage.setItem('incomes', JSON.stringify(state.incomes));
  }, [state.incomes]);
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(state.expenses));
  }, [state.expenses]);
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(state.categories));
  }, [state.categories]);
  useEffect(() => {
    localStorage.setItem('cards', JSON.stringify(state.cards));
  }, [state.cards]);
  useEffect(() => {
    localStorage.setItem('purchases', JSON.stringify(state.purchases));
  }, [state.purchases]);
  useEffect(() => {
    localStorage.setItem('savings', JSON.stringify(state.savings));
  }, [state.savings]);

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
    addIncome: r => setState(s => ({ ...s, incomes: [...s.incomes, { ...r, id: uid() }] })),
    removeIncome: id => setState(s => ({ ...s, incomes: s.incomes.filter(i => i.id !== id) })),
    addExpense: e => setState(s => ({ ...s, expenses: [...s.expenses, { ...e, id: uid() }] })),
    removeExpense: id => setState(s => ({ ...s, expenses: s.expenses.filter(i => i.id !== id) })),
    addCategory: c => setState(s => ({ ...s, categories: [...s.categories, { ...c }] })),
    addCard: c => setState(s => ({ ...s, cards: [...s.cards, { ...c, id: uid() }] })),
    addPurchase: p => setState(s => ({ ...s, purchases: [...s.purchases, { ...p, id: uid() }] })),
    removePurchase: id => setState(s => ({ ...s, purchases: s.purchases.filter(i => i.id !== id) })),
    addMeta: m => setState(s => ({ ...s, savings: [...s.savings, { ...m, id: uid() }] })),
    deposit: (metaId, amount) => setState(s => ({
      ...s,
      savings: s.savings.map(m => m.id === metaId ? { ...m, current: m.current + amount } : m)
    })),
  };

  return <Ctx.Provider value={{ ...state, ...actions }}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp outside provider');
  return ctx;
}
