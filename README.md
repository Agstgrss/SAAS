# SaaS Scrum

Aplicação fullstack inspirada no modelo Jira/Scrum com dashboard de projetos, quadro Kanban e autenticação multi‑tenant.

está online na AWS em http://3.142.131.143:3000/login

## 📦 Visão geral

- **Backend:** API REST em Express + TypeScript com Prisma para acessar PostgreSQL. Cada usuário pertence a um tenant (empresa) e só vê projetos/tarefas do próprio workspace.
- **Frontend:** Next.js 16 (App Router) com React 19, CSS customizado e componentes reutilizáveis. Login, cadastro, dashboard e quadro Kanban consomem a API.
- **Conteinerização:** Docker Compose orchestrando Postgres, backend e frontend com persistência e scripts de inicialização automáticos.
- **Design system:** Variáveis CSS, botões, cartas, formulários e modais documentados em `frontend/DESIGN_SYSTEM.md`.

## 📁 Estrutura principal

```
SAAS/
├── backend/    # Express + Prisma + scripts Docker
├── frontend/   # Next.js + Design System + componentes reutilizáveis
├── docker-compose.yml
├── context.md  # Visão geral e documentação complementar
```

## ⚙️ Execução local

### Pré-requisitos
- Node.js 20+ (mesmos usados nas imagens Docker)
- npm
- PostgreSQL 15 (ou use o container `db`)

### Banco de dados & Prisma

1. Ajuste `backend/.env` (ou `DATABASE_URL` para seu host local).
2. Gere o cliente e rode migrações/seeds:
   ```bash
   cd backend
   npm install
   npx prisma generate
   npx prisma migrate dev --name init
   npx prisma db seed
   ```
   > O `entrypoint.sh` também já executa `migrate deploy` + `db seed` quando o container docker sobe.

### Backend

```bash
cd backend
npm install
npm run dev       # tsx watch na porta 3333
npm run build
npm start         # roda build compilado
```

- A porta padrão é `3333`.
- Variáveis essenciais estão em `backend/.env`: `PORT`, credenciais Postgres , `DATABASE_URL` e `JWT_SECRET`.
- As rotas estão em `backend/src/routes.ts`, os controllers delegam para serviços em `backend/src/services` e há validação Zod em `backend/src/schemas`.

### Frontend

```bash
cd frontend
npm install
npm run dev       # Next.js dev server na porta 3000
npm run lint
npm run build
npm start
```

- O `NEXT_PUBLIC_API_URL` (em `frontend/.env`) aponta para `http://localhost:3333` ou para a URL do backend em produção.
- O `apiRequest` (em `frontend/src/services/api.ts`) adiciona o token Bearer obtido em `localStorage`.
- Componentes reutilizáveis vivem em `frontend/src/components/layout`.

### Variáveis de ambiente

| Arquivo | Variáveis chave |
| ------- | --------------- |
| `backend/.env` | `PORT`, `POSTGRES_*`, `DATABASE_URL`, `JWT_SECRET` |
| `frontend/.env` | `NEXT_PUBLIC_API_URL` |

> O `.env_example` de cada pasta pode ser usado como template para ambientes locais/dockers.

## 🔗 API REST (backend)

| Método | Rota | Proteção | Payload |
| --- | --- | --- | --- |
| `POST /users` | cadastra usuário (name, email, password, tenantId) | público | `createUserSchema` |
| `POST /tenants` | cria tenant (name) | público | `createTenantSchema` |
| `POST /session` | autentica (email, password) | público | `authUserSchema` |
| `GET /me` | retorna dados do usuário logado | Bearer JWT | |
| `GET /projects` | lista projetos do tenant | Bearer JWT | |
| `POST /projects` | cria projeto (name, description) | Bearer JWT + validação | `createProjectSchema` |
| `GET /tasks?projectId=` | lista tarefas de um projeto | Bearer JWT | |
| `POST /tasks` | cria tarefa (title, projectId, status?, dueDate?, assignedToId?) | Bearer JWT | `createTaskSchema` |
| `PUT /tasks/:id` | atualiza tarefa (title?, status?, dueDate?, description?) | Bearer JWT | `updateTaskSchema` |
| `DELETE /tasks/:id` | remove tarefa | Bearer JWT | |

- A autenticação fica a cargo do middleware `isAuthenticated`, que injeta `req.user_id` (veja `backend/src/@types/express/index.d.ts`).
- Validações de payload são feitas por `backend/src/middlewares/validateSchema.ts`.
- `CreateTaskService`, `UpdateTaskService` e `DeleteTaskService` garantem que o usuário pertence ao tenant do projeto.
- O JWT inclui `sub = user.id` e expira em 30 dias.

## 🧱 Entidades principais (Prisma)

- `Tenant`: empresas/workspaces. Relacionamentos com usuários, projetos e tarefas.
- `User`: campos `id`, `tenantId`, `name`, `email`, `passwordHash`, `role` (`ADMIN | MEMBER`), `createdAt`. Email único por tenant. Usa bcryptjs para hash.
- `Project`: liga tenant + usuário criador, guarda nome/descrição e data de criação.
- `Task`: status (`TODO | DOING | DONE`), prazo (ISO 8601), atribuição opcional. Teve `onDelete: Cascade` em todas as relações.
- `seed.ts` (Prisma + adapter PG) cria tenants de exemplo ao subir o backend.

## 🧑‍💻 Frontend & UX

- **Páginas principais:**
  - `/login`: formulário com alertas, redireciona para `/dashboard` se já existir token.
  - `/register`: carrega tenants, permite selecionar organização e registrar novo usuário.
  - `/dashboard`: lista projetos do tenant, formulário de criação e cards clicáveis.
  - `/projects/[id]`: Kanban com 3 colunas (TODO, DOING, DONE), modais para criar/editar/excluir tarefas.

- **Componentes layout reutilizáveis:** `PageWrapper`, `Header`, `Container`, `Card`, `Grid`, `FormCard`, `FormField`, `Button`, `Alert`.
- **Fluxo de autenticação no frontend:**
  1. Usuário registra-se (escolhe tenant) → POST `/users`.
  2. Login → POST `/session` → armazena `token` em `localStorage`.
  3. Requisições enviam `Authorization: Bearer {token}`.
  4. Logout remove token e redireciona.

- **Design system:** `frontend/src/app/globals.css` define paleta de cores, espacamentos, tipografia, componentes, animações e responsividade. Consulte também `frontend/DESIGN_SYSTEM.md`.

- **Serviços de dados:** `frontend/src/services/*` abstraem chamadas para `/users`, `/tenants`, `/projects` e `/tasks`.

## 🐳 Docker Compose

1. Configure `backend/.env` (Postgres contém `DB_HOST=db` no container).
2. Suba containers:
   ```bash
   docker-compose up --build
   ```
3. Serviços expostos:
   - `db`: Postgres 15 em `5432`. Volume persistente `postgres_data`.
   - `backend`: Express em `3333`, `entrypoint.sh` aguarda DB, aplica migrations e seed antes de rodar `npm run dev`.
   - `frontend`: Next.js em `3000`, aponta `NEXT_PUBLIC_API_URL` para o backend e usa polling para watch.

4. Logs:
   ```bash
   docker-compose logs -f
   docker-compose exec saas_backend npm run dev
   ```
5. Clean:
   ```bash
   docker-compose down
   ```

## 📚 Documentação complementar

- `context.md` — documentação geral do projeto, fluxo de autenticação, lista de próximos passos e visão detalhada da arquitetura.
- `frontend/DESIGN_SYSTEM.md` — especificações do design system CSS e tokens de interface.
- `backend/prisma/schema.prisma` — modelo completo do banco (Tenant, User, Project, Task, enums).
- `backend/src/routes.ts` — mapa de rotas e middlewares.

## 🚀 Próximos passos sugeridos

- Expandir filtros/paginação nas listagens.
- Adicionar drag & drop no board e atribuição de tarefas a usuários.
- Implementar toasts, dark mode e histórico de atividades.
- Criar pipeline CI/CD (GitHub Actions) com testes e lint.
- Monitorar via Prometheus/Grafana + backups automáticos do banco.

## 🤝 Contribuições

- Abra issues para bugs ou ideias.
- Siga os scripts `npm run lint` (frontend) e `npm run build` antes de submeter PRs.
- Documente novas APIs e componentes no `context.md` ou crie novos MDs na raiz.
