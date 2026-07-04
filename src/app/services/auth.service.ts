import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  LoginRequestDTO,
  CadastroRequestDTO,
  EsqueceuSenhaRequestDTO,
  VerificarCodigoRequestDTO,
  RedefinirSenhaRequestDTO,
  TokenResponseDTO
} from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly STORAGE_KEY = 'taisyoga_auth_token';

  // State via Signals
  readonly authState = signal<TokenResponseDTO | null>(this.getInitialState());
  readonly loading = signal<boolean>(false);
  readonly erro = signal<string | null>(null);

  // Derived state via computed
  readonly isAuthenticated = computed(() => !!this.authState()?.token);
  readonly currentUserId = computed(() => this.authState()?.id ?? null);
  readonly currentUser = computed(() => this.authState()?.nome ?? null);
  readonly currentEmail = computed(() => this.authState()?.email ?? null);
  readonly token = computed(() => this.authState()?.token ?? null);

  private getInitialState(): TokenResponseDTO | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (!saved) {
      return null;
    }
    try {
      return JSON.parse(saved) as TokenResponseDTO;
    } catch {
      localStorage.removeItem(this.STORAGE_KEY);
      return null;
    }
  }

  private saveSession(response: TokenResponseDTO): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(response));
    }
    this.authState.set(response);
  }

  login(dto: LoginRequestDTO): Observable<TokenResponseDTO> {
    this.loading.set(true);
    this.erro.set(null);

    return this.http.post<TokenResponseDTO>(`${this.apiUrl}/login`, dto).pipe(
      tap((res) => {
        this.saveSession(res);
        this.loading.set(false);
      }),
      catchError((err: HttpErrorResponse) => {
        this.loading.set(false);
        const mensagem = err.error?.erro ?? 'E-mail ou senha inválidos.';
        this.erro.set(mensagem);
        return throwError(() => err);
      })
    );
  }

  cadastrar(dto: CadastroRequestDTO): Observable<TokenResponseDTO> {
    this.loading.set(true);
    this.erro.set(null);

    return this.http.post<TokenResponseDTO>(`${this.apiUrl}/cadastro`, dto).pipe(
      tap((res) => {
        this.saveSession(res);
        this.loading.set(false);
      }),
      catchError((err: HttpErrorResponse) => {
        this.loading.set(false);
        const mensagem = err.error?.erro ?? 'Erro ao realizar cadastro.';
        this.erro.set(mensagem);
        return throwError(() => err);
      })
    );
  }

  esqueceuSenha(dto: EsqueceuSenhaRequestDTO): Observable<{ mensagem?: string }> {
    this.loading.set(true);
    this.erro.set(null);

    return this.http.post<{ mensagem?: string }>(`${this.apiUrl}/esqueceu-senha`, dto).pipe(
      tap(() => {
        this.loading.set(false);
      }),
      catchError((err: HttpErrorResponse) => {
        this.loading.set(false);
        const mensagem = err.error?.erro ?? 'Não foi possível processar a solicitação.';
        this.erro.set(mensagem);
        return throwError(() => err);
      })
    );
  }

  verificarCodigo(dto: VerificarCodigoRequestDTO): Observable<{ valido?: boolean; mensagem?: string }> {
    this.loading.set(true);
    this.erro.set(null);

    return this.http.post<{ valido?: boolean; mensagem?: string }>(`${this.apiUrl}/verificar-codigo`, dto).pipe(
      tap(() => {
        this.loading.set(false);
      }),
      catchError((err: HttpErrorResponse) => {
        this.loading.set(false);
        const mensagem = err.error?.erro ?? 'Código de verificação inválido.';
        this.erro.set(mensagem);
        return throwError(() => err);
      })
    );
  }

  redefinirSenha(dto: RedefinirSenhaRequestDTO): Observable<{ mensagem?: string }> {
    this.loading.set(true);
    this.erro.set(null);

    return this.http.post<{ mensagem?: string }>(`${this.apiUrl}/redefinir-senha`, dto).pipe(
      tap(() => {
        this.loading.set(false);
      }),
      catchError((err: HttpErrorResponse) => {
        this.loading.set(false);
        const mensagem = err.error?.erro ?? 'Não foi possível redefinir a senha.';
        this.erro.set(mensagem);
        return throwError(() => err);
      })
    );
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
    this.authState.set(null);
  }
}

