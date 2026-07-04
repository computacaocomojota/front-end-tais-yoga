import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AgendamentoHeaderComponent } from './components/header/agendamento-header.component';
import { AgendamentoService } from '../../services/agendamento.service';
import { Agendamento, StatusAgendamento, ModalidadeAula } from '../../models/agendamento.model';

@Component({
  selector: 'app-agendamento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AgendamentoHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './agendamento.component.html',
  styleUrls: ['./agendamento.component.scss'],
  host: {
    '(document:keydown.escape)': 'fecharModais()'
  }
})
export class AgendamentoComponent implements OnInit {
  readonly agendamentoService = inject(AgendamentoService);

  ngOnInit(): void {
    this.agendamentoService.carregarAgendamentos();
  }

  readonly filtroAtual = signal<'Todos' | StatusAgendamento>('Todos');
  readonly modalAberto = signal<boolean>(false);
  readonly modalCancelamentoAberto = signal<boolean>(false);
  readonly itemEmEdicao = signal<Agendamento | null>(null);
  readonly itemParaCancelar = signal<Agendamento | null>(null);

  readonly agendamentosFiltrados = computed(() => {
    const todos = this.agendamentoService.agendamentos();
    const filtro = this.filtroAtual();
    if (filtro === 'Todos') {
      return todos;
    }
    return todos.filter(a => a.status === filtro);
  });

  readonly formAgendamento = new FormGroup({
    tituloAula: new FormControl<string>('Yoga Relaxante', { nonNullable: true, validators: [Validators.required] }),
    modalidade: new FormControl<ModalidadeAula>('Presencial', { nonNullable: true, validators: [Validators.required] }),
    dataAula: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    horario: new FormControl<string>('08:00', { nonNullable: true, validators: [Validators.required] }),
    instrutor: new FormControl<string>('Taíse Coutinho', { nonNullable: true, validators: [Validators.required] }),
    status: new FormControl<StatusAgendamento>('Confirmado', { nonNullable: true }),
    observacoes: new FormControl<string>('', { nonNullable: true })
  });

  readonly opcoesAulas = [
    'Yoga Relaxante',
    'Flow Matinal',
    'Despertar Suave',
    'Hatha Yoga Tradicional',
    'Vinyasa Flow Energizante',
    'Meditação e Respiração'
  ];

  readonly opcoesHorarios = [
    '07:00', '08:00', '09:30', '16:00', '18:00', '19:30'
  ];

  setFiltro(filtro: 'Todos' | StatusAgendamento): void {
    this.filtroAtual.set(filtro);
  }

  formatarData(data?: string): string {
    if (!data) return '';
    const match = data.match(/^(\d{4})[\/-](\d{2})[\/-](\d{2})/);
    if (match) {
      const [_, ano, mes, dia] = match;
      return `${dia}/${mes}/${ano}`;
    }
    return data;
  }

  abrirModalCriacao(): void {
    this.itemEmEdicao.set(null);
    const agora = new Date();
    const dia = String(agora.getDate()).padStart(2, '0');
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const ano = agora.getFullYear();
    const hoje = `${dia}/${mes}/${ano}`;

    this.formAgendamento.reset({
      tituloAula: 'Yoga Relaxante',
      modalidade: 'Presencial',
      dataAula: hoje,
      horario: '08:00',
      instrutor: 'Taíse Coutinho',
      status: 'Confirmado',
      observacoes: ''
    });
    this.modalAberto.set(true);
  }

  abrirModalEdicao(item: Agendamento): void {
    this.itemEmEdicao.set(item);
    this.formAgendamento.patchValue({
      tituloAula: item.tituloAula,
      modalidade: item.modalidade,
      dataAula: this.formatarData(item.dataAula),
      horario: item.horario,
      instrutor: item.instrutor,
      status: item.status,
      observacoes: item.observacoes || ''
    });
    this.modalAberto.set(true);
  }

  fecharModal(): void {
    this.modalAberto.set(false);
    this.itemEmEdicao.set(null);
  }

  salvarAgendamento(): void {
    if (this.formAgendamento.invalid) {
      this.formAgendamento.markAllAsTouched();
      return;
    }

    const valores = this.formAgendamento.getRawValue();
    const valoresFormatados = {
      ...valores,
      dataAula: this.formatarData(valores.dataAula)
    };
    const edicao = this.itemEmEdicao();

    if (edicao && edicao.id) {
      this.agendamentoService.atualizarAgendamento(edicao.id, valoresFormatados);
    } else {
      this.agendamentoService.criarAgendamento(valoresFormatados);
    }

    this.fecharModal();
  }

  abrirModalCancelamento(item: Agendamento): void {
    this.itemParaCancelar.set(item);
    this.modalCancelamentoAberto.set(true);
  }

  fecharModalCancelamento(): void {
    this.modalCancelamentoAberto.set(false);
    this.itemParaCancelar.set(null);
  }

  fecharModais(): void {
    if (this.modalAberto()) {
      this.fecharModal();
    }
    if (this.modalCancelamentoAberto()) {
      this.fecharModalCancelamento();
    }
  }

  confirmarCancelamento(): void {
    const item = this.itemParaCancelar();
    if (item && item.id) {
      this.agendamentoService.alterarStatus(item.id, 'Cancelado');
    }
    this.fecharModalCancelamento();
  }

  excluirDefinitivo(item: Agendamento): void {
    if (item.id && confirm(`Deseja realmente excluir o agendamento da aula "${item.tituloAula}" do banco de dados?`)) {
      this.agendamentoService.excluirAgendamento(item.id);
    }
  }
}
