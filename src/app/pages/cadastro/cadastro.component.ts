import { Component, ChangeDetectionStrategy, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss'],
})
export class CadastroComponent {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  readonly authService = inject(AuthService);

  readonly showSenha = signal(false);
  readonly showConfirmarSenha = signal(false);
  readonly showSuccessModal = signal(false);

  readonly cadastroForm = new FormGroup({
    nome: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    senha: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
    confirmarSenha: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
  });

  toggleSenhaVisibility(): void {
    this.showSenha.update(v => !v);
  }

  toggleConfirmarSenhaVisibility(): void {
    this.showConfirmarSenha.update(v => !v);
  }

  onSubmit(): void {
    if (this.cadastroForm.valid) {
      const { nome, email, senha } = this.cadastroForm.getRawValue();
      this.authService.cadastrar({ nome, email, senha })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.showSuccessModal.set(true);
          },
          error: () => {
            // Capturado por this.authService.erro()
          }
        });
    } else {
      this.cadastroForm.markAllAsTouched();
    }
  }

  fecharModalEirParaLogin(): void {
    this.showSuccessModal.set(false);
    this.router.navigate(['/login']);
  }
}
