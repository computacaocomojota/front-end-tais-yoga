# 🍃​ Taíse Yoga - Website

<img width="365" height="414" alt="3" src="https://github.com/user-attachments/assets/74622ddc-cf3e-42a6-a6f0-fea7d57f6678" />


## Funcionalidades Principais

* **Landing Page Completa:** Seções detalhadas incluindo Hero (Banner), Benefícios, Biografia da instrutora, Planos de Preços, FAQ (Perguntas Frequentes) e Depoimentos de clientes.
* **Single Page Application (SPA):** Navegação instantânea e sem recarregamento de página entre as rotas de *Home*, *Login* e *Cadastro*, gerenciada pelo Angular Router.
* **Scrolling:** Navegação entre as seções da página principal utilizando âncoras HTML e CSS nativo.
* **Formulários Reativos:** Gerenciamento de estado e validação de dados para as seções de "Fale Conosco" e fluxos de autenticação, utilizando o `ReactiveFormsModule` do Angular.
* **Tipografia:** Integração otimizada com o Google Fonts, utilizando as famílias *Cormorant Garamond* (títulos) e *Open Sans* (corpo de texto).

## Tecnologias Utilizadas

<div>
  <img src="https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white" />
</div>

## 📁 Estrutura de Pastas Destacada

A arquitetura do projeto foi pensada para separação clara de responsabilidades, seguindo as melhores práticas do Angular moderno:

```text
front-end/
├── public/                 
│   └── assets/             
│       ├── images/         # Imagens de fundo e fotos de perfil
│       └── icons/          # Logotipos e ícones SVG (checks, setas, etc.)
├── src/
│   ├── app/
│   │   ├── pages/          # Páginas Roteáveis (Home, Login, Cadastro)
│   │   ├── sections/       # Componentes de UI reutilizáveis (Header, Hero, Pricing...)
│   │   ├── app.config.ts   # Configuração de Rotas (Router Providers)
│   │   └── app.ts          # Componente Raiz da Aplicação (RouterOutlet)
│   ├── index.html          # Ponto de entrada HTML e importação de fontes
│   ├── main.ts             # Bootstrap da aplicação
│   └── styles.scss         # Estilos globais (Variáveis de cor, tipografia global)
# front-end-tais-yoga
# front-end-tais-yoga
