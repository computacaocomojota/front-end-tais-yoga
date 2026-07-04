import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Agendamento, StatusAgendamento } from '../models/agendamento.model';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly apiUrl = `${environment.apiUrl}/agendamentos`;

  // Estado Reativo principal via Signals (modern Angular best practice)
  readonly agendamentos = signal<Agendamento[]>([]);

  readonly loading = signal<boolean>(false);
  readonly erro = signal<string | null>(null);

  // Computed properties para o Dashboard interativo
  readonly totalCount = computed(() => this.agendamentos().length);
  readonly confirmadosCount = computed(() => 
    this.agendamentos().filter(a => a.status === 'Confirmado').length
  );
  readonly pendentesCount = computed(() => 
    this.agendamentos().filter(a => a.status === 'Pendente').length
  );
  readonly canceladosCount = computed(() => 
    this.agendamentos().filter(a => a.status === 'Cancelado').length
  );

  constructor() {
    this.carregarAgendamentos();
  }

  carregarAgendamentos(): void {
    this.loading.set(true);
    this.erro.set(null);

    const userId = this.authService.currentUserId();
    const url = userId ? `${this.apiUrl}?usuarioId=${userId}` : this.apiUrl;

    this.http.get<Agendamento[]>(url).pipe(
      tap((dados) => {
        if (Array.isArray(dados)) {
          this.agendamentos.set(dados);
        }
        this.loading.set(false);
      }),
      catchError(() => {
        // Fallback para funcionamento imediato no frontend (modo offline / demonstração)
        this.loading.set(false);
        return of(this.agendamentos());
      })
    ).subscribe();
  }

  criarAgendamento(novo: Omit<Agendamento, 'id'>): void {
    this.loading.set(true);
    const userId = this.authService.currentUserId();
    const payload = userId ? { ...novo, usuarioId: userId } : novo;

    const novoComId: Agendamento = {
      ...payload,
      id: Date.now()
    };

    this.http.post<Agendamento>(this.apiUrl, payload).pipe(
      tap((criado) => {
        this.agendamentos.update(lista => [criado || novoComId, ...lista]);
        this.loading.set(false);
      }),
      catchError(() => {
        // Atualização otimista/fallback em memória
        this.agendamentos.update(lista => [novoComId, ...lista]);
        this.loading.set(false);
        return of(novoComId);
      })
    ).subscribe();
  }

  atualizarAgendamento(id: number, atualizado: Partial<Agendamento>): void {
    this.loading.set(true);

    this.http.put<Agendamento>(`${this.apiUrl}/${id}`, atualizado).pipe(
      tap((item) => {
        this.agendamentos.update(lista =>
          lista.map(a => (a.id === id ? { ...a, ...item } : a))
        );
        this.loading.set(false);
      }),
      catchError(() => {
        // Fallback em memória
        this.agendamentos.update(lista =>
          lista.map(a => (a.id === id ? { ...a, ...atualizado } : a))
        );
        this.loading.set(false);
        return of(null);
      })
    ).subscribe();
  }

  alterarStatus(id: number, status: StatusAgendamento): void {
    this.atualizarAgendamento(id, { status });
  }

  excluirAgendamento(id: number): void {
    this.loading.set(true);

    this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.agendamentos.update(lista => lista.filter(a => a.id !== id));
        this.loading.set(false);
      }),
      catchError(() => {
        // Fallback em memória
        this.agendamentos.update(lista => lista.filter(a => a.id !== id));
        this.loading.set(false);
        return of(null);
      })
    ).subscribe();
  }
}
