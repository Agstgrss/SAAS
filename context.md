# Contexto do Projeto - SaaS Scrum

Este documento fornece uma visão geral completa das rotas, serviços, entidades, design system, arquitetura Docker e outras partes chave da aplicação backend e frontend.

**Stack Tecnológico:**
- Backend: Node.js + Express + TypeScript + Prisma + PostgreSQL
- Frontend: Next.js 16 + React 19 + TypeScript
- Autenticação: JWT (JSON Web Tokens)
- Validação: Zod
- Segurança: bcryptjs para hash de senhas
- Containerização: Docker + Docker Compose

---

## 🔗 Rotas HTTP

As rotas definidas em `backend/src/routes.ts` são:

| Método | Caminho     | Proteção          | Validação de Schema        | Descrição                                      |
|--------|-------------|-------------------|----------------------------|------------------------------------------------|
| POST   | `/users`    | não               | `createUserSchema`         | Criar novo usuário                             |
| POST   | `/tenants`  | não               | `createTenantSchema`       | Registrar nova empresa (tenant)               |
| POST   | `/session`  | não               | `authUserSchema`           | Autenticar usuário e obter token              |
| GET    | `/me`       | `isAuthenticated` | -                          | Detalhes do usuário autenticado               |
| GET    | `/project`  | `isAuthenticated` | -                          | Listar projetos do usuário autenticado        |
| POST   | `/projects` | `isAuthenticated` | `createProjectSchema`      | Criar projeto dentro da empresa               |
| POST   | `/tasks`    | `isAuthenticated` | `createTaskSchema`         | Criar tarefa associada a projeto              |

> **Nota:** Validações são feitas pelo middleware `validateSchema` usando os schemas do Zod localizados em `src/schemas`.

---

## 🎨 Frontend

### Páginas Implementadas

- **Login** (`/login`) - Página de autenticação do usuário com formulário estilizado
- **Register** (`/register`) - Página de registro de novo usuário
- **Dashboard** (`/dashboard`) - Painel principal com lista de projetos do usuário
- **Project Board** (`/projects/[id]`) - Quadro Kanban com gerenciamento de tarefas

### Componentes de Página

Cada página foi redesenhada usando componentes de layout reutilizáveis:

#### Login Page (`frontend/src/app/login/page.tsx`)
- FormCard centralizado com título e subtítulo
- 2 campos de input (email e senha) com validação
- Alerta de erro dinâmico
- Link para página de registro
- Estados de carregamento

#### Register Page (`frontend/src/app/register/page.tsx`)
- FormCard com 4 campos (nome, email, senha, tenantId)
- Validação de campos obrigatórios
- Alerta de erro
- Link para página de login
- Estado de carregamento

#### Dashboard Page (`frontend/src/app/dashboard/page.tsx`)
Componente cliente que:
- Carrega dados do usuário atual via `getMe()` 
- Lista projetos do usuário via `getProjects()` (consome GET `/project`)
- Exibe usuario no Header com botão de logout
- Grid de cards para cada projeto com ação de abrir
- Card para criar novo projeto com inputs de nome e descrição
- Redireciona para `/login` se não autenticado
- Estados: `user`, `projects`, `error`, `isLoading`

#### Project Board Page (`frontend/src/app/projects/[id]/page.tsx`)
- Quadro Kanban com 3 colunas: TODO, DOING, DONE
- Criar novas tarefas com título
- Modal para editar/deletar tarefas
- Campos de tarefa: título, descrição, status, prazo
- Navegação back -> Dashboard
- Botão de logout

---

## 🎨 Design System CSS

### Visão Geral
Sistema de design completo implementado com **CSS puro** (sem Tailwind), variáveis CSS e componentes React reutilizáveis. Padroniza toda a interface do sistema.

**Arquivo principal:** `frontend/src/app/globals.css` (900+ linhas)

### Variáveis CSS Definidas

#### Cores
```css
/* Primárias */
--color-primary: #2563eb (Azul)
--color-primary-dark: #1e40af
--color-primary-light: #dbeafe

/* Secundárias */
--color-secondary: #7c3aed (Roxo)
--color-secondary-dark: #6d28d9

/* Status */
--color-success: #10b981 (Verde)
--color-warning: #f59e0b (Amarelo)
--color-danger: #ef4444 (Vermelho)
--color-info: #06b6d4 (Ciano)

/* Escala de Cinza */
--color-gray-50 até --color-gray-900
```

#### Tipografia
- Tamanhos: xs (12px), sm (14px), base (16px), lg (18px), xl (20px), 2xl, 3xl, 4xl (36px)
- Pesos: normal (400), medium (500), semibold (600), bold (700)
- Line heights: tight (1.25), normal (1.5), relaxed (1.625)
- Font family: System stack + fallback
- Mono: Courier New para código

#### Espaçamento
Escala consistente de 4px até 80px
```css
--spacing-1: 0.25rem (4px)   --spacing-2: 0.5rem (8px)
--spacing-3: 0.75rem (12px)  --spacing-4: 1rem (16px)
--spacing-5: 1.25rem (20px)  --spacing-6: 1.5rem (24px)
--spacing-8: 2rem (32px)     --spacing-10 a --spacing-20
```

#### Border Radius
- sm: 6px
- md: 8px
- lg: 12px
- xl: 16px
- full: 9999px (círculos)

#### Sombras
- sm, md, lg, xl - Shadow drop com múltiplas camadas

#### Transições
- fast: 150ms
- base: 200ms
- slow: 300ms

### Componentes CSS Definidos

#### Buttons
Classes: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-outline`, `.btn-danger`, `.btn-success`
Tamanhos: `.btn-sm`, `.btn-lg`
Estados: hover, disabled, loading

#### Inputs/Forms
Estilos para `input`, `textarea`, `select` com:
- Focus state com shadow azul
- Placeholder styled
- Disabled state cinzento
- Classes: `.form-group`, `.form-label`, `.form-error`

#### Cards
- `.card` - Cartão com sombra e padding
- `.card-header`, `.card-body`, `.card-footer`
- Efeito hover com elevation

#### Headers
- `header` - Sticky no topo
- `.header-content` - Flex container
- `.header-actions` - Alinhado à direita

#### Alertas
- `.alert-success` (verde)
- `.alert-error` (vermelho)
- `.alert-warning` (amarelo)
- `.alert-info` (ciano)

#### Modais
- `.modal-overlay` - Fundo escuro com fade-in
- `.modal` - Slide-in animation
- `.modal-header`, `.modal-body`, `.modal-footer`
- `.modal-close` - Botão X

#### Badges
- `.badge-primary`, `.badge-success`, `.badge-danger`, `.badge-warning`, `.badge-info`

#### Grid/Flex
- `.grid`, `.grid-cols-1`, `.grid-cols-2`, `.grid-cols-3`
- `.flex`, `.flex-col`, `.flex-center`, `.flex-between`
- `.gap-2`, `.gap-3`, `.gap-4`, `.gap-6`

#### Utilitários
- Margens: `.mt-*`, `.mb-*`
- Padding: `.p-*`, `.pt-*`, `.pb-*`
- Texto: `.text-center`, `.text-muted`, `.text-success`, `.text-danger`
- Font: `.font-bold`, `.font-semibold`
- Display: `.hidden`, `.visible`
- Opacity: `.opacity-50`, `.opacity-75`

### Componentes React Reutilizáveis

Localização: `frontend/src/components/layout/`

1. **PageWrapper** - Wrapper raiz para toda página com altura mínima
2. **Header** - Cabeçalho sticky com título, subtítulo, ações e botão voltar
3. **Container** - Container com max-width responsivo (sm, md, lg, full)
4. **Card** - Cartão com título, subtítulo, conteúdo e footer
5. **Grid** - Grid responsivo com 1-3 colunas e gaps customizáveis
6. **FormCard** - Card especializado para formulários com submit/cancel
7. **FormField** - Wrapper para campo + label + erro
8. **Button** - Botão com variadas (primary, secondary, outline, danger, success)
9. **Alert** - Alerta com 4 tipos (success, error, warning, info)

### Responsividade

Breakpoints:
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

Ajustes automáticos:
- Grids colapsam para 1 coluna em mobile
- Font sizes reduzem em telas pequenas
- Modais ajustam width para 95% em mobile
- Botões ocupam 100% em telas pequenas

### Animações

- **fadeIn** - Entrada com Opacity 0 -> 1
- **slideIn** - Entrada com translateY(20px) -> 0
- **Hover effects** - Elevation com shadow e transform
- **Transições suaves** - Em cores, borders, shadows

---

## 🛠 Serviços (business logic)

Cada controller delega a lógica para um serviço especializado em `src/services`.
Abaixo um resumo das responsabilidades:

- **User**
  - `CreateUserService` – valida unicidade, hash de senha e criação de usuário.
  - `AuthUserService` – verifica credenciais e gera JWT.
  - `DetailUserService` – busca dados do usuário com base no ID.

- **Tenant**
  - `CreateTenantService` – cria novo tenant/empresa.

- **Project**
  - `CreateProjectService` – cria projeto ligado a um tenant e usuário criador.
  - `ListProjectService` – lista projetos do usuário autenticado.

- **Task**
  - `CreateTaskService` – cria tarefa atrelada a projeto e tenant; opcionalmente atribui usuário.

> Todos os serviços utilizam `prismaClient` para interação com o banco de dados.

---

## 📦 Esquemas/Validações

Schemas Zod em `src/schemas` definem as entradas aceitas:

- `userSchema.ts` – criação e autenticação de usuário.
- `createTenantSchema.ts` – dados para cadastrar tenant.
- `projectSchema.ts` – informações de nome/descrição de projeto.
- `taskSchema.ts` – dados de título, descrição, status, etc.

Esses objetos são aplicados nas rotas através do middleware `validateSchema`.

---

## 🗄 Banco de Dados (Prisma Models)

O modelo Prisma em `prisma/schema.prisma` descreve as tabelas:

- **Tenant**
  - campos: `id`, `name`, `createdAt`
  - relações: `users`, `projects`, `tasks`

- **User**
  - campos: `id`, `tenantId`, `name`, `email`, `passwordHash`, `role`, `createdAt`
  - enum `Role` = `ADMIN` | `MEMBER`
  - relações: pertence a `Tenant`; projetos criados; tarefas atribuídas
  - índice único em `[tenantId, email]`

- **Project**
  - campos: `id`, `tenantId`, `name`, `description?`, `createdById`, `createdAt`
  - relação com `Tenant` e `User` (criador)
  - lista de `tasks`

- **Task**
  - campos: `id`, `tenantId`, `projectId`, `title`, `description?`, `status`, `assignedToId?`, `dueDate?`, `createdAt`
  - enum `TaskStatus` = `TODO` | `DOING` | `DONE`
  - relações com `Tenant`, `Project` e usuário atribuído

> Todas as relações definem `onDelete: Cascade` para manter integridade ao remover registros.

---

## 🔐 Middlewares

- `isAuthenticated.ts` – extrai token Bearer, valida JWT e injeta `req.userId`.
- `validateSchema.ts` – aplica o schema Zod e retorna 400 em caso de erro.

---

## 🐳 Docker & Containerização

### Docker Compose (`docker-compose.yml`)

Orquestra 3 serviços:

#### 1. Database (PostgreSQL 15)
```yaml
- Container: saas_db
- Porta: 5433:5432
- Credenciais: postgres / as45sd56
- Database: saas_db
- Volume: postgres_data (persistência)
- Auto-restart: sempre
```

#### 2. Backend (Node.js + Express)
```yaml
- Container: saas_backend
- Porta: 3333:3333
- Dockerfile: ./backend/Dockerfile
- Dependências: db (aguarda inicialização)
- Env File: .env.docker
- Node ENV: production
- Auto-restart: sempre
```

#### 3. Frontend (Next.js)
```yaml
- Container: saas_frontend
- Porta: 3000:3000
- Dockerfile: ./frontend/Dockerfile
- Dependências: backend
- API URL: http://backend:3333 (interno)
- Auto-restart: sempre
```

### Backend Dockerfile
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate  # Gera Prisma Client
EXPOSE 3333
CMD ["npm", "run", "dev"]  # Executa em modo dev
```

### Frontend Dockerfile
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build  # Build otimizado
EXPOSE 3000
CMD ["npm", "start"]  # Inicia servidor Next.js
```

### Scripts de Desenvolvimento

**Backend:**
- `npm run dev` - Inicia com tsx watch (hot reload)
- `npm run build` - Compila TypeScript
- `npm start` - Inicia servidor compilado

**Frontend:**
- `npm run dev` - Inicia Next.js dev server na porta 3000
- `npm run build` - Build otimizado para produção
- `npm start` - Inicia servidor Next.js
- `npm run lint` - Executa ESLint

### Variáveis de Ambiente

**Backend (.env.docker / .env.local):**
- `DATABASE_URL` - String de conexão PostgreSQL
- `JWT_SECRET` - Chave para assinatura de tokens
- `API_PORT` - Porta do servidor (default: 3333)
- `NODE_ENV` - environment (development/production)

**Frontend (.env):**
- `NEXT_PUBLIC_API_URL` - URL da API backend

### Como Executar com Docker

```bash
# Iniciar todos os serviços
docker-compose up -d

# Parar serviços
docker-compose down

# Ver logs
docker-compose logs -f

# Acessar banco de dados
docker exec -it saas_db psql -U postgres -d saas_db

# Executar migrations no container
docker exec saas_backend npx prisma migrate deploy
```

---

## 🚀 Melhorias Gerais Implementadas

### Frontend
✅ **Design System CSS Completo**
- Sistema variáveis CSS padronizado
- Componentes reutilizáveis React
- Responsividade mobile-first
- Animações e transições suaves
- Paleta de cores profissional
- 9 componentes de layout exportáveis

✅ **Atualizadas Todas as Páginas**
- Login: Formulário elegante com alerta de erro
- Register: Form com 4 campos validados
- Dashboard: Grid de projetos com card de criação
- Board: Kanban com modais de edição

✅ **Melhorias UX**
- Feedback visual de loading
- Alertas contextualizados (success/error/warning/info)
- Validação de campos com asteriscos obrigatórios
- Tratamento de erros amigável

### Backend
✅ **Estrutura Estabelecida**
- Controllers, Services, Schemas bem separados
- Validação com Zod
- Autenticação JWT
- Middleware de autenticação
- ORM Prisma configurado

✅ **Segurança**
- Password hash com bcryptjs
- JWT tokens com sub (userId)
- Middleware isAuthenticated em rotas protegidas
- Schema validation em todas as entradas

### DevOps
✅ **Docker & Docker Compose**
- 3 containers: DB, Backend, Frontend
- AutoRestart configurado
- Volumes para persistência de dados
- Networking automático entre containers

✅ **Estrutura de Arquivos**
- Dockerfile para backend e frontend
- Docker Compose para orquestração
- .env files segregados (local, docker, example)
- .gitignore configurado

### Documentação
✅ **Documentos de Referência**
- `context.md` - Este arquivo (visão geral do projeto)
- `DESIGN_SYSTEM.md` - Frontend design system detalhado
- `.env_example` - Template para variáveis de ambiente

---

## 🧱 Estrutura de Pastas Completa

```
SAAS/
├── context.md                  # Este arquivo - Visão geral do projeto
├── docker-compose.yml          # Orquestração de containers
│
├── backend/
│   ├── Dockerfile              # Image do backend Node.js Alpine
│   ├── .env.docker             # Vars de ambiente para Docker
│   ├── .env.local              # Vars de ambiente local
│   ├── .env_example            # Template de vars
│   ├── package.json            # Scripts: dev, build, start
│   ├── tsconfig.json           # Configuração TypeScript
│   ├── prisma.config.ts        # Config do Prisma
│   │
│   ├── prisma/
│   │   ├── schema.prisma       # Modelos DB (Tenant, User, Project, Task)
│   │   ├── migrations/         # Histórico de migrations
│   │   └── migration_lock.toml # Lock file
│   │
│   └── src/
│       ├── server.ts           # Startup do servidor
│       ├── app.ts              # Configuração Express
│       ├── routes.ts           # Todas as rotas HTTP
│       │
│       ├── controllers/        # Recebem requisições
│       │   ├── user/
│       │   │   ├── CreateUserController.ts
│       │   │   ├── AuthUserController.ts
│       │   │   └── DetailUserController.ts
│       │   ├── project/
│       │   │   ├── CreateProjectController.ts
│       │   │   └── ListProjectsController.ts
│       │   ├── task/
│       │   │   ├── CreateTaskController.ts
│       │   │   ├── ListTaskController.ts
│       │   │   ├── UpdateTaskController.ts
│       │   │   └── DeleteTaskController.ts
│       │   └── tenant/
│       │       └── CreateTenantController.ts
│       │
│       ├── services/           # Lógica de negócio
│       │   ├── user/
│       │   │   ├── CreateUserService.ts
│       │   │   ├── AuthUserService.ts
│       │   │   └── DetailUserService.ts
│       │   ├── project/
│       │   │   ├── CreateProjectService.ts
│       │   │   └── ListProjectsService.ts
│       │   ├── task/
│       │   │   ├── CreateTaskService.ts
│       │   │   ├── ListTaskService.ts
│       │   │   ├── UpdateTaskService.ts
│       │   │   └── DeleteTaskService.ts
│       │   └── tenant/
│       │       └── CreateTenantService.ts
│       │
│       ├── schemas/            # Validação Zod
│       │   ├── userSchema.ts
│       │   ├── createTenantSchema.ts
│       │   ├── projectSchema.ts
│       │   └── taskSchema.ts
│       │
│       ├── middlewares/        # Express middlewares
│       │   ├── isAuthenticated.ts
│       │   └── validateSchema.ts
│       │
│       ├── prisma/
│       │   └── index.ts        # PrismaClient singleton
│       │
│       ├── config/             # Configurações
│       │
│       └── @types/             # Type definitions
│           └── express/
│               └── index.d.ts  # Extend Express Request
│
│
├── frontend/
│   ├── Dockerfile              # Image do Next.js Alpine
│   ├── DESIGN_SYSTEM.md        # Documentação do design system
│   ├── package.json            # Scripts: dev, build, start, lint
│   ├── tsconfig.json           # Configuração TypeScript
│   ├── next.config.ts          # Config Next.js
│   ├── eslint.config.mjs       # ESLint config
│   ├── postcss.config.mjs      # PostCSS config
│   ├── .env                    # Vars de ambiente
│   ├── .env.example            # Template
│   ├── README.md               # Docs do frontend
│   │
│   ├── public/                 # Assets estáticos
│   │
│   └── src/
│       ├── app/
│       │   ├── globals.css     # DESIGN SYSTEM CSS (900+ linhas)
│       │   ├── layout.tsx      # Layout raiz (html/body)
│       │   ├── page.tsx        # Home -> Redirect /login
│       │   │
│       │   ├── login/
│       │   │   └── page.tsx    # Login com FormCard e Alerts
│       │   │
│       │   ├── register/
│       │   │   └── page.tsx    # Register com 4 campos
│       │   │
│       │   ├── dashboard/
│       │   │   └── page.tsx    # Dashboard com Grid de projetos
│       │   │
│       │   └── projects/
│       │       ├── project-not-found/
│       │       └── [id]/
│       │           └── page.tsx# Board Kanban com 3 colunas
│       │
│       ├── components/
│       │   ├── layout/         # 9 Componentes reutilizáveis
│       │   │   ├── Header.tsx
│       │   │   ├── PageWrapper.tsx
│       │   │   ├── Container.tsx
│       │   │   ├── Card.tsx
│       │   │   ├── Grid.tsx
│       │   │   ├── FormCard.tsx
│       │   │   ├── FormField.tsx
│       │   │   ├── Button.tsx
│       │   │   ├── Alert.tsx
│       │   │   └── index.ts    # Exports
│       │   │
│       │   ├── board/          # Componentes específicos do board
│       │   │   └── TaskModal.tsx
│       │   │
│       │   ├── project/        # Componentes de projeto
│       │   ├── ui/             # Componentes UI genéricos
│       │   └── layout/         # Componentes de layout
│       │
│       ├── services/           # Chamadas HTTP para API
│       │   ├── api.ts          # Fetch wrapper
│       │   ├── auth.ts         # Auth endpoints
│       │   ├── projects.ts     # Projects endpoints
│       │   └── project/        # Endpoints por projeto
│       │
│       ├── hooks/              # React hooks customizados
│       │
│       ├── contexts/           # React contexts
│       │
│       ├── types/              # TypeScript types
│       │   └── task.ts
│       │
│       └── utils/              # Funções utilitárias
```

---

## 📱 Fluxo de Autenticação

1. **Registro** → POST `/users` + POST `/tenants`
2. **Login** → POST `/session` com email/password → retorna JWT token
3. **Storage** → Token salvo em `localStorage` (chave: "token")
4. **Requisições** → Header `Authorization: Bearer {token}`
5. **Validação** → Middleware `isAuthenticated` valida JWT
6. **Logout** → Remove token do localStorage

**Rotas Protegidas:**
- GET `/me` - Requer token
- GET `/project` - Requer token
- POST `/projects` - Requer token
- POST `/tasks` - Requer token
- PUT `/tasks/{id}` - Requer token
- DELETE `/tasks/{id}` - Requer token

---

## 📊 Relacionamentos do Banco de Dados

```
Tenant (1) ──→ (N) User
         ├──→ (N) Project
         └──→ (N) Task

User (1) ──→ (N) Project (criador)
     └──→ (N) Task (atribuído)

Project (1) ──→ (N) Task
         └──→ (1) User (criador)

Task ──→ Project (projeto pai)
    ├──→ Tenant (tenant proprietário)
    └──→ User (opcional - atribuído)
```

Todas as relações usam `onDelete: Cascade` para limpeza automática.

---

## 📈 Próximos Passos Sugeridos

### Backend
- [ ] Rotas GET `/tasks/{id}` para detalhes
- [ ] Filtros avançados em listagens
- [ ] Paginação em GET `/project`
- [ ] Rate limiting
- [ ] Healthcheck endpoint
- [ ] Error handling mais robusto

### Frontend
- [ ] Dark mode (variáveis CSS já suportam)
- [ ] Toast notifications
- [ ] Busca/filtro de projetos
- [ ] Drag & drop de tarefas
- [ ] Edição inline de tarefa
- [ ] Assign tarefa a usuários
- [ ] Comentários em tarefas
- [ ] Histórico de atividades

### DevOps
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Nginx reverse proxy
- [ ] SSL/TLS certificates
- [ ] Backup automático do DB
- [ ] Monitoring (Prometheus/Grafana)
- [ ] Logging centralizado

---

## 🎯 Referência Rápida de Comandos

### Desenvolvimento Local

```bash
# Backend
cd backend
npm install
npm run dev          # Inicia em http://localhost:3333

# Frontend (em outro terminal)
cd frontend
npm install
npm run dev          # Inicia em http://localhost:3000
```

### Com Docker

```bash
# Iniciar environment completo
docker-compose up -d

# Development
docker-compose logs -f                    # Ver logs
docker-compose down                       # Parar tudo
docker-compose exec saas_backend npm run dev  # Reinicia backend
```

### Banco de Dados

```bash
# Executar migrations
cd backend
npx prisma migrate dev --name init

# Resetar banco
npx prisma migrate reset

# Acessar via Docker
docker exec -it saas_db psql -U postgres -d saas_db
```

### Prisma

```bash
# Gerar Prisma Client
npx prisma generate

# Abrir Prisma Studio (GUI)
npx prisma studio

# Format schema.prisma
npx prisma format
```

---

## 🔑 Credenciais Padrão (Desenvolvimento)

```
PostgreSQL (Docker):
- Usuário: postgres
- Senha: as45sd56
- Banco: saas_db
- Porta: 5433

Backend: http://localhost:3333
Frontend: http://localhost:3000
```

---

## 📖 Documentação Adicional

- **Design System Detalhado**: Veja `frontend/DESIGN_SYSTEM.md`
- **Schema Prisma**: Veja `backend/prisma/schema.prisma`
- **Rotas Backend**: Veja `backend/src/routes.ts`
- **Variables CSS**: Veja `frontend/src/app/globals.css` (linhas 1-200)

---

> **Última Atualização:** Março de 2026
>
> Este documento serve como referência completa para desenvolvedores que trabalham no projeto,
> incluindo visão geral da arquitetura, stack tecnológico, design system CSS, Docker,
> documentação de componentes, fluxos de dados e próximas melhorias sugeridas.

---