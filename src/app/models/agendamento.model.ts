export type StatusAgendamento = 'Confirmado' | 'Pendente' | 'Cancelado';
export type ModalidadeAula = 'Presencial' | 'Online';

export interface Agendamento {
  id?: number;
  tituloAula: string;
  modalidade: ModalidadeAula;
  dataAula: string; // Ex: '2026-12-12' ou '12 Dez'
  horario: string;  // Ex: '08:00'
  instrutor: string; // Ex: 'Taíse Coutinho'
  status: StatusAgendamento;
  observacoes?: string;
  usuarioId?: number;
  usuarioNome?: string;
}

export interface AgendamentoDTO {
  id?: number;
  tituloAula: string;
  modalidade: string;
  dataAula: string;
  horario: string;
  instrutor: string;
  status: string;
  observacoes?: string;
  usuarioId?: number;
  usuarioNome?: string;
}
