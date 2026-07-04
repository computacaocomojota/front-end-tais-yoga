import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./pages/cadastro/cadastro.component').then(m => m.CadastroComponent)
  },
  {
    path: 'esqueceu-senha',
    loadComponent: () => import('./pages/esqueceu-senha/esqueceu-senha.component').then(m => m.EsqueceuSenhaComponent)
  },
  {
    path: 'agendamentos',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/agendamento/agendamento.component').then(m => m.AgendamentoComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];

