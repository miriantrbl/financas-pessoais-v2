import type { Receita, Despesa, Cartao, CompraCartao, Meta, Categoria } from '../types';

export const defaultCategories: Categoria[] = [
  { name: 'Saúde', color: '#2BA89A' },
  { name: 'Lazer', color: '#8B5CF6' },
  { name: 'Alimentação', color: '#E8883A' },
  { name: 'Transporte', color: '#3B82C4' },
  { name: 'Educação', color: '#D6478F' },
  { name: 'Moradia', color: '#6366C9' },
  { name: 'Contas', color: '#4FA3A8' },
  { name: 'Compras', color: '#C2569B' },
  { name: 'Outros', color: '#8A867E' },
];

export const defaultIncomes: Receita[] = [
  { id: 'r1', source: 'Salário — Studio Vértice', category: 'Salário', amount: 7200, date: '2026-06-05', recurring: true },
  { id: 'r2', source: 'Reembolso viagem', category: 'Outros', amount: 460, date: '2026-06-09', recurring: false },
  { id: 'r3', source: 'Dividendos', category: 'Investimentos', amount: 340, date: '2026-06-14', recurring: false },
  { id: 'r4', source: 'Salário — Studio Vértice', category: 'Salário', amount: 7200, date: '2026-05-05', recurring: true },
  { id: 'r5', source: 'Freelance design', category: 'Freelance', amount: 1500, date: '2026-05-20', recurring: false },
  { id: 'r6', source: 'Salário — Studio Vértice', category: 'Salário', amount: 7200, date: '2026-04-05', recurring: true },
  { id: 'r7', source: 'Salário — Studio Vértice', category: 'Salário', amount: 7200, date: '2026-03-05', recurring: true },
  { id: 'r8', source: 'Dividendos', category: 'Investimentos', amount: 480, date: '2026-03-15', recurring: false },
  { id: 'r9', source: 'Salário — Studio Vértice', category: 'Salário', amount: 7200, date: '2026-02-05', recurring: true },
  { id: 'r10', source: 'Salário — Studio Vértice', category: 'Salário', amount: 7200, date: '2026-01-05', recurring: true },
  { id: 'r11', source: 'Freelance', category: 'Freelance', amount: 900, date: '2026-01-20', recurring: false },
];

export const defaultExpenses: Despesa[] = [
  { id: 'e1', desc: 'Uber', category: 'Transporte', amount: 64, date: '2026-06-16', type: 'Variável' },
  { id: 'e2', desc: 'Aluguel', category: 'Moradia', amount: 1850, date: '2026-06-05', type: 'Fixa' },
  { id: 'e3', desc: 'Academia', category: 'Saúde', amount: 120, date: '2026-06-01', type: 'Fixa' },
  { id: 'e4', desc: 'Internet', category: 'Contas', amount: 120, date: '2026-06-10', type: 'Fixa' },
  { id: 'e5', desc: 'Conta de luz', category: 'Contas', amount: 180, date: '2026-06-08', type: 'Variável' },
  { id: 'e6', desc: 'Curso online', category: 'Educação', amount: 198, date: '2026-06-12', type: 'Fixa' },
  { id: 'e7', desc: 'Restaurante', category: 'Alimentação', amount: 320, date: '2026-06-18', type: 'Variável' },
  { id: 'e8', desc: 'Farmácia', category: 'Saúde', amount: 85, date: '2026-06-20', type: 'Variável' },
  { id: 'e9', desc: 'Streaming', category: 'Lazer', amount: 55, date: '2026-06-01', type: 'Fixa' },
  { id: 'e10', desc: 'Gasolina', category: 'Transporte', amount: 250, date: '2026-06-15', type: 'Variável' },
  { id: 'e11', desc: 'Seguro saúde', category: 'Saúde', amount: 260, date: '2026-06-03', type: 'Fixa' },
  // Maio
  { id: 'e12', desc: 'Aluguel', category: 'Moradia', amount: 1850, date: '2026-05-05', type: 'Fixa' },
  { id: 'e13', desc: 'Academia', category: 'Saúde', amount: 120, date: '2026-05-01', type: 'Fixa' },
  { id: 'e14', desc: 'Internet', category: 'Contas', amount: 120, date: '2026-05-10', type: 'Fixa' },
  { id: 'e15', desc: 'Mercado', category: 'Alimentação', amount: 680, date: '2026-05-15', type: 'Variável' },
  // Abril
  { id: 'e16', desc: 'Aluguel', category: 'Moradia', amount: 1850, date: '2026-04-05', type: 'Fixa' },
  { id: 'e17', desc: 'Internet', category: 'Contas', amount: 120, date: '2026-04-10', type: 'Fixa' },
  { id: 'e18', desc: 'Cinema', category: 'Lazer', amount: 90, date: '2026-04-20', type: 'Variável' },
  // Março
  { id: 'e19', desc: 'Aluguel', category: 'Moradia', amount: 1850, date: '2026-03-05', type: 'Fixa' },
  { id: 'e20', desc: 'Farmácia', category: 'Saúde', amount: 340, date: '2026-03-10', type: 'Variável' },
  // Fevereiro
  { id: 'e21', desc: 'Aluguel', category: 'Moradia', amount: 1850, date: '2026-02-05', type: 'Fixa' },
  { id: 'e22', desc: 'Internet', category: 'Contas', amount: 120, date: '2026-02-10', type: 'Fixa' },
  // Janeiro
  { id: 'e23', desc: 'Aluguel', category: 'Moradia', amount: 1850, date: '2026-01-05', type: 'Fixa' },
  { id: 'e24', desc: 'Gasolina', category: 'Transporte', amount: 300, date: '2026-01-20', type: 'Variável' },
];

export const defaultCards: Cartao[] = [
  { id: 'c1', name: 'Nubank Pessoal', issuer: 'Nubank', last4: '4821', grad: 'linear-gradient(135deg,#9b2fe0,#5b07a0)', limit: 8000, closing: 28, due: 5 },
  { id: 'c2', name: 'Nubank PJ', issuer: 'Nubank', last4: '1130', grad: 'linear-gradient(135deg,#820ad1,#4a0578)', limit: 15000, closing: 20, due: 28 },
  { id: 'c3', name: 'Itaú José', issuer: 'Itaú', last4: '7745', grad: 'linear-gradient(135deg,#ec7000,#a23b00)', limit: 6000, closing: 15, due: 22 },
  { id: 'c4', name: 'Nubank José', issuer: 'Nubank', last4: '9002', grad: 'linear-gradient(135deg,#7a17c9,#3a0a5e)', limit: 3000, closing: 3, due: 10 },
];

export const defaultPurchases: CompraCartao[] = [
  // Nubank Pessoal (c1)
  { id: 'p1', cardId: 'c1', desc: 'iPhone 15 Pro', category: 'Compras', total: 7499, installments: 10, startY: 2026, startM: 1, parc: true },
  { id: 'p2', cardId: 'c1', desc: 'Netflix', category: 'Lazer', total: 55.90, installments: 1, startY: 2026, startM: 5, parc: false },
  { id: 'p3', cardId: 'c1', desc: 'Spotify', category: 'Lazer', total: 21, installments: 1, startY: 2026, startM: 5, parc: false },
  { id: 'p4', cardId: 'c1', desc: 'Mercado', category: 'Alimentação', total: 354, installments: 1, startY: 2026, startM: 5, parc: false },
  { id: 'p5', cardId: 'c1', desc: 'Tênis Nike', category: 'Compras', total: 450, installments: 3, startY: 2026, startM: 4, parc: true },
  { id: 'p6', cardId: 'c1', desc: 'Posto gasolina', category: 'Transporte', total: 100, installments: 1, startY: 2026, startM: 5, parc: false },
  // Nubank PJ (c2)
  { id: 'p7', cardId: 'c2', desc: 'Adobe Creative Cloud', category: 'Educação', total: 300, installments: 1, startY: 2026, startM: 5, parc: false },
  { id: 'p8', cardId: 'c2', desc: 'Notebook Dell', category: 'Compras', total: 8400, installments: 12, startY: 2025, startM: 9, parc: true },
  { id: 'p9', cardId: 'c2', desc: 'Hospedagem servidor', category: 'Contas', total: 250, installments: 1, startY: 2026, startM: 5, parc: false },
  { id: 'p10', cardId: 'c2', desc: 'Mobília escritório', category: 'Compras', total: 3600, installments: 6, startY: 2026, startM: 2, parc: true },
  // Itaú José (c3)
  { id: 'p11', cardId: 'c3', desc: 'Supermercado', category: 'Alimentação', total: 280, installments: 1, startY: 2026, startM: 5, parc: false },
  { id: 'p12', cardId: 'c3', desc: 'Seguro auto', category: 'Transporte', total: 568, installments: 1, startY: 2026, startM: 5, parc: false },
  // Nubank José (c4)
  { id: 'p13', cardId: 'c4', desc: 'Farmácia', category: 'Saúde', total: 120, installments: 1, startY: 2026, startM: 5, parc: false },
];

export const defaultSavings: Meta[] = [
  { id: 'm1', name: 'Reserva de emergência', target: 50000, current: 22000, color: '#2BA89A', monthly: 1500 },
  { id: 'm2', name: 'Viagem Europa', target: 15000, current: 7500, color: '#8B5CF6', monthly: 800 },
  { id: 'm3', name: 'Carro novo', target: 60000, current: 2500, color: '#E8883A', monthly: 500 },
];
