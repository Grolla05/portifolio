# Portfolio Profissional - Felipe Grolla

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/felipe-grolla-freitas-projects/v0-professional-resume-page)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2015-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

## 📋 Visão Geral

Portfolio profissional moderno com design inspirado em aplicações nativas do macOS, desenvolvido com Next.js 15, React 19 e Tailwind CSS. A interface apresenta um sistema de design sofisticado com tema claro/escuro, efeitos glassmorphism e animações suaves.

## ✨ Características Principais

### 🎨 Design System

- **Tema Dual**: Modo claro e escuro com transições suaves
- **Paleta de Cores**:
  - Light Mode: Gradientes de slate (50-900)
  - Dark Mode: Tons de azul profundo (#011627, #01243e)
  - Accent Colors:
    - Azul (#4D5BCE)
    - Verde (#43D9AD)
    - Coral (#E99287)
- **Efeitos Visuais**:
  - Glassmorphism com backdrop-blur
  - Sombras sutis e elevações
  - Gradientes radiais para profundidade
  - Bordas arredondadas consistentes

### 🏠 Página Inicial (Home)

**Localização**: `app/page.tsx`

- **Hero Section**:

  - Layout em duas colunas (conteúdo + snippets de código)
  - Apresentação pessoal com tipografia hierárquica
  - Link para GitHub com estilo de código
  - Efeitos de gradiente de fundo animados

- **Code Snippets** (Lado Direito):

  - 3 janelas de código estilo macOS com traffic lights funcionais
  - **SQL Query**: Demonstração de consulta com JOIN
  - **Python Function**: Função de processamento de dados
  - **JavaScript Function**: Função assíncrona com fetch
  - Syntax highlighting customizado para cada linguagem
  - Hover effects e transições suaves

- **Social Links**:
  - GitHub e LinkedIn no rodapé
  - Ícones com hover states
  - Username display (@Grolla05)

### 👤 Página Sobre (About)

**Localização**: `app/about/page.tsx`

- **Sidebar Explorer**:

  - Estrutura de pastas colapsáveis
  - 3 seções principais:
    - **Bio** (`my-bio.md`): Informações pessoais
    - **Hobbies** (`hobbies.ts`): Interesses e hobbies
    - **Education** (`Education.tsx`): Formação acadêmica
  - Seção de contatos com email e telefone
  - Ícones específicos por tipo de arquivo (Markdown, TypeScript, React)

- **Componentes**:
  - `Bio`: Biografia pessoal
  - `Hobbie`: Lista de hobbies e interesses
  - `Education`: Timeline de educação

### 💼 Página de Projetos (Projects)

**Localização**: `app/projects/page.tsx`

- **Sistema de Filtros**:

  - Filtro por linguagens/tecnologias (14 opções)
  - Ordenação por data (mais recentes/mais antigos)
  - Checkboxes interativos com estados visuais
  - Ícones de tecnologia com imagens customizadas

- **Grid de Projetos**:
  - Layout responsivo (1-3 colunas)
  - 7 projetos destacados:
    1. Simula Médias
    2. Solar Points
    3. Bot Discord V1
    4. Arduino Projects
    5. MIT 6.002.1x
    6. CS50
    7. Projeto Relógio de LED
- **Cards de Projeto**:

  - Header com número e slug
  - Imagem placeholder com gradiente
  - Ícone principal da tecnologia (center)
  - Badges de tecnologias (top-right)
  - Descrição completa
  - Link para repositório GitHub
  - Hover effects e transições

- **Tecnologias Suportadas**:
  - React, HTML5, Tailwind CSS
  - JavaScript, Python, SQL
  - C, C++, Arduino
  - Next.js, Flask, Node.js, Vite
  - Hardware

### 📧 Página de Contato (Contact)

**Localização**: `app/contact/page.tsx`

- **Layout em 3 Colunas**:

  1. **Sidebar**: Contatos e redes sociais
  2. **Formulário Central**: Interface de envio de mensagens
  3. **Code Preview**: Visualização do código em tempo real

- **Formulário**:

  - Campos: Nome, Email, Mensagem
  - Integração com EmailJS
  - Validação e feedback visual
  - Botão de submit estilizado

- **Code Preview**:

  - Snippet JavaScript dinâmico
  - Atualização em tempo real conforme digitação
  - Numeração de linhas
  - Syntax highlighting
  - Botão de copiar código com feedback visual

- **Sidebar de Contatos**:
  - Email: felipegrolla@gmail.com
  - Telefone: +55 (19) 99999-9999
  - Links para YouTube, LinkedIn, Instagram

### 🎯 Componentes Compartilhados

**Sidebar de Ícones** (Todas as páginas):

- Terminal icon
- User icon (placeholder)
- Gamepad icon
- Posicionamento fixo à esquerda
- Hover states

**Header Tabs**:

- Indicador de página/arquivo atual
- Botões de fechar (decorativos)
- Bordas consistentes

## 🛠️ Stack Tecnológico

### Core

- **Next.js 15.2.4**: Framework React com App Router
- **React 19**: Biblioteca UI
- **TypeScript 5**: Tipagem estática
- **Tailwind CSS 3.4**: Estilização utility-first

### UI Components

- **Radix UI**: Componentes acessíveis headless
- **Lucide React**: Biblioteca de ícones
- **next-themes**: Gerenciamento de temas

### Funcionalidades

- **EmailJS**: Envio de emails do formulário de contato
- **React Hook Form**: Gerenciamento de formulários
- **Zod**: Validação de schemas

### Ferramentas

- **class-variance-authority**: Variantes de componentes
- **clsx & tailwind-merge**: Utilitários de className
- **autoprefixer**: Prefixos CSS automáticos

## 📁 Estrutura do Projeto

```
v0-professional-resume-page/
├── app/
│   ├── about/
│   │   └── page.tsx          # Página sobre
│   ├── contact/
│   │   └── page.tsx          # Página de contato
│   ├── projects/
│   │   └── page.tsx          # Página de projetos
│   ├── layout.tsx            # Layout raiz
│   ├── page.tsx              # Página inicial
│   └── not-found.tsx         # Página 404
├── components/
│   ├── about/
│   │   ├── bio.tsx           # Componente de biografia
│   │   ├── hobbie.tsx        # Componente de hobbies
│   │   └── education.tsx     # Componente de educação
│   └── ui/                   # Componentes UI reutilizáveis
├── public/
│   ├── language_icons/       # Ícones de tecnologias
│   └── thumbnails/           # Imagens de projetos
├── styles/
│   └── globals.css           # Estilos globais
└── tailwind.config.ts        # Configuração Tailwind

```

## 🚀 Começando

### Pré-requisitos

- Node.js 18+
- npm ou pnpm

### Instalação

```bash
# Clone o repositório
git clone https://github.com/Grolla05/v0-professional-resume-page.git

# Entre no diretório
cd v0-professional-resume-page

# Instale as dependências
npm install
# ou
pnpm install

# Execute o servidor de desenvolvimento
npm run dev
# ou
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

### Build para Produção

```bash
npm run build
npm start
```

## 🎨 Customização

### Cores do Tema

Edite `tailwind.config.ts` para customizar as cores:

```typescript
theme: {
  extend: {
    colors: {
      // Suas cores customizadas
    }
  }
}
```

### Conteúdo

- **Projetos**: Edite o array `projects` em `app/projects/page.tsx`
- **Bio**: Modifique `components/about/bio.tsx`
- **Contato**: Atualize as informações em `app/contact/page.tsx`

### EmailJS Setup

1. Crie uma conta em [EmailJS](https://www.emailjs.com/)
2. Configure um serviço de email
3. Crie um template
4. Atualize as credenciais em `app/contact/page.tsx`:

```typescript
emailjs.sendForm("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", form.current, {
  publicKey: "YOUR_PUBLIC_KEY",
});
```

## 📱 Responsividade

- **Mobile First**: Design otimizado para dispositivos móveis
- **Breakpoints**:
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
  - `2xl`: 1536px

## 🌐 Deploy

### Vercel (Recomendado)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Grolla05/v0-professional-resume-page)

### Outras Plataformas

O projeto pode ser deployado em qualquer plataforma que suporte Next.js:

- Netlify
- AWS Amplify
- Railway
- Render

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👤 Autor

**Felipe Grolla**

- GitHub: [@Grolla05](https://github.com/Grolla05)
- LinkedIn: [felipegrolla](https://www.linkedin.com/in/felipegrolla/)
- Email: fegrolla0210@gmail.com

## 🙏 Agradecimentos

- Design inspirado em aplicações nativas do macOS
- Ícones por [Lucide](https://lucide.dev/)
- UI Components por [Radix UI](https://www.radix-ui.com/)
- Desenvolvido com [v0.dev](https://v0.dev/)
