export const MES_ABR = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
export const MES_FULL = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

export const TODAY = { y: 2026, m: 5, d: 21 };

export function fmt(v: number): string {
  return 'R$ ' + Math.abs(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function fmtSigned(v: number): string {
  return (v < 0 ? '-' : '') + fmt(v);
}

export function fmtShort(v: number): string {
  return 'R$ ' + Math.abs(Math.round(v)).toLocaleString('pt-BR');
}

export function fmtDate(iso: string): string {
  const [, m, d] = iso.split('-');
  return `${parseInt(d)} ${MES_ABR[parseInt(m) - 1]}`;
}

export function parseMoney(s: string): number {
  return parseFloat(s.replace(/\./g, '').replace(',', '.')) || 0;
}

import type { CompraCartao } from '../types';

export function installmentInfo(p: CompraCartao, y: number, m: number) {
  const offset = (y - p.startY) * 12 + (m - p.startM);
  const included = offset >= 0 && offset < p.installments;
  const valorParcela = p.total / p.installments;
  const parcelaAtual = offset + 1;
  const restante = p.installments - parcelaAtual;
  const lastIdx = p.startM + p.installments - 1;
  const ultimoMes = MES_ABR[lastIdx % 12] + '/' + (p.startY + Math.floor(lastIdx / 12));
  return { included, valorParcela, parcelaAtual, restante, ultimoMes };
}

export function installmentLabel(p: CompraCartao, y: number, m: number): string {
  const { parcelaAtual, restante, ultimoMes } = installmentInfo(p, y, m);
  if (!p.parc) return `Pagamento à vista · ${MES_ABR[p.startM]}/${p.startY}`;
  return `Parcela ${parcelaAtual} de ${p.installments} · faltam ${restante} · última em ${ultimoMes}`;
}

export function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const CAT_COLORS: Record<string, string> = {
  'Saúde': '#2BA89A',
  'Lazer': '#8B5CF6',
  'Alimentação': '#E8883A',
  'Transporte': '#3B82C4',
  'Educação': '#D6478F',
  'Moradia': '#6366C9',
  'Contas': '#4FA3A8',
  'Compras': '#C2569B',
  'Outros': '#8A867E',
};

export const CAT_PALETTE = ['#2BA89A','#8B5CF6','#E8883A','#3B82C4','#D6478F','#6366C9','#C2569B','#E11D48','#0EA5E9','#65A30D'];

export function catColor(name: string, categories: {name:string;color:string}[]): string {
  const found = categories.find(c => c.name === name);
  if (found) return found.color;
  return CAT_COLORS[name] || '#8A867E';
}
