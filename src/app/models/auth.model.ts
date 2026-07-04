export interface LoginRequestDTO {
  email: string;
  senha: string;
}

export interface CadastroRequestDTO {
  nome: string;
  email: string;
  senha: string;
}

export interface EsqueceuSenhaRequestDTO {
  email: string;
}

export interface TokenResponseDTO {
  id?: number;
  token: string;
  tipo: string; // Ex: 'Bearer'
  email: string;
  nome: string;
}

export interface AuthErrorResponse {
  timestamp?: string;
  status?: number;
  erro?: string;
  detalhes?: Record<string, string>;
}

export interface VerificarCodigoRequestDTO {
  email: string;
  codigo: string;
}

export interface RedefinirSenhaRequestDTO {
  email: string;
  codigo?: string;
  novaSenha: string;
}

