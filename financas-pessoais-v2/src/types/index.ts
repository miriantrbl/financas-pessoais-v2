export type Categoria = { name: string; color: string };

export type Receita = {
  id: string;
  source: string;
  category: string;
  amount: number;
  date: string;
  recurring: boolean;
};

export type Despesa = {
  id: string;
  desc: string;
  category: string;
  amount: number;
  date: string;
  type: 'Fixa' | 'Variável';
};

export type Cartao = {
  id: string;
  name: string;
  issuer: string;
  last4: string;
  grad: string;
  limit: number;
  closing: number;
  due: number;
};

export type CompraCartao = {
  id: string;
  cardId: string;
  desc: string;
  category: string;
  total: number;
  installments: number;
  startY: number;
  startM: number;
  parc: boolean;
};

export type Meta = {
  id: string;
  name: string;
  target: number;
  current: number;
  color: string;
  monthly: number;
};

export type Emprestimo = {
  id: string;
  desc: string;
  total: number;
  installments: number;
  startY: number;
  startM: number;
  color: string;
};

export type Tab = 'inicio' | 'receitas' | 'despesas' | 'cartoes' | 'poupanca' | 'emprestimos';
export type Theme = 'light' | 'dark';
export type HomeVariant = 'A' | 'B';

export type ModalType =
  | { type: 'receita' }
  | { type: 'despesa' }
  | { type: 'cartao' }
  | { type: 'compra'; cardId: string }
  | { type: 'categoria' }
  | { type: 'depositar'; metaId: string }
  | { type: 'meta' }
  | { type: 'editar-meta'; metaId: string }
  | { type: 'emprestimo' }
  | null;
