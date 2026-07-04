import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-esqueceu-senha',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './esqueceu-senha.component.html',
  styleUrls: ['./esqueceu-senha.component.scss']
})
export class EsqueceuSenhaComponent {
  private readonly router = inject(Router);
  readonly authService = inject(AuthService);

  readonly step = signal<'email' | 'codigo' | 'redefinir'>('email');
  readonly userEmail = signal<string>('');
  readonly showPassword = signal<boolean>(false);
  readonly showNewPassword = signal<boolean>(false);
  readonly showSuccessModal = signal<boolean>(false);
  readonly codeDigits = signal<string[]>(['', '', '', '']);

  readonly emailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  readonly senhaForm = new FormGroup({
    senha: new FormControl('', [Validators.required, Validators.minLength(6)]),
    novaSenha: new FormControl('', [Validators.required])
  }, { validators: this.passwordMatchValidator });

  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const senha = group.get('senha')?.value;
    const novaSenha = group.get('novaSenha')?.value;
    return senha && novaSenha && senha !== novaSenha ? { senhasNaoCoincidem: true } : null;
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  toggleNewPasswordVisibility(): void {
    this.showNewPassword.update(v => !v);
  }

  onDigitInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9]/g, '');

    if (value.length > 1) {
      value = value.charAt(0);
      input.value = value;
    }

    const currentDigits = [...this.codeDigits()];
    currentDigits[index] = value;
    this.codeDigits.set(currentDigits);

    if (value && index < 3) {
      const nextInput = document.getElementById(`code-${index + 1}`) as HTMLInputElement;
      nextInput?.focus();
    }
  }

  onDigitKeydown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && !input.value && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`) as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
        const currentDigits = [...this.codeDigits()];
        currentDigits[index - 1] = '';
        this.codeDigits.set(currentDigits);
      }
    } else if (event.key === 'ArrowLeft' && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`) as HTMLInputElement;
      prevInput?.focus();
    } else if (event.key === 'ArrowRight' && index < 3) {
      const nextInput = document.getElementById(`code-${index + 1}`) as HTMLInputElement;
      nextInput?.focus();
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text/plain').replace(/[^0-9]/g, '');
    if (pastedData) {
      const digits = pastedData.slice(0, 4).split('');
      const currentDigits = ['', '', '', ''];
      digits.forEach((digit, i) => {
        currentDigits[i] = digit;
      });
      this.codeDigits.set(currentDigits);

      const focusIdx = Math.min(digits.length, 3);
      const targetInput = document.getElementById(`code-${focusIdx}`) as HTMLInputElement;
      targetInput?.focus();
    }
  }

  onSubmitEmail(): void {
    if (this.emailForm.valid) {
      const email = this.emailForm.value.email ?? '';
      this.userEmail.set(email);
      this.authService.esqueceuSenha({ email }).subscribe({
        next: () => {
          this.step.set('codigo');
        },
        error: () => {
          // Capturado no serviço
        }
      });
    } else {
      this.emailForm.markAllAsTouched();
    }
  }

  reenviarCodigo(): void {
    const email = this.userEmail();
    if (email) {
      this.authService.esqueceuSenha({ email }).subscribe();
    }
  }

  onSubmitCodigo(): void {
    const code = this.codeDigits().join('');
    if (code.length === 4) {
      this.authService.verificarCodigo({ email: this.userEmail(), codigo: code }).subscribe({
        next: () => {
          this.step.set('redefinir');
        },
        error: () => {
          // Capturado no serviço
        }
      });
    }
  }

  onSubmitSenha(): void {
    if (this.senhaForm.valid) {
      const { senha, novaSenha } = this.senhaForm.value;
      const code = this.codeDigits().join('');
      if (senha && novaSenha) {
        this.authService.redefinirSenha({
          email: this.userEmail(),
          codigo: code,
          novaSenha: novaSenha
        }).subscribe({
          next: () => {
            this.showSuccessModal.set(true);
          },
          error: () => {
            // Capturado no serviço
          }
        });
      }
    } else {
      this.senhaForm.markAllAsTouched();
    }
  }

  voltarEtapa(): void {
    const atual = this.step();
    if (atual === 'codigo') {
      this.step.set('email');
    } else if (atual === 'redefinir') {
      this.step.set('codigo');
    } else {
      this.router.navigate(['/login']);
    }
  }

  irParaLogin(): void {
    this.showSuccessModal.set(false);
    this.router.navigate(['/login']);
  }
}
