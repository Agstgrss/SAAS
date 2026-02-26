# Contexto do Projeto

Este documento fornece uma visão geral das rotas, serviços, entidades (tabelas) e outras partes chave da aplicação backend.

---

## 🔗 Rotas HTTP

As rotas definidas em `backend/src/routes.ts` são:

| Método | Caminho     | Proteção          | Validação de Schema        | Descrição                                      |
|--------|-------------|-------------------|----------------------------|------------------------------------------------|
| POST   | `/users`    | não               | `createUserSchema`         | Criar novo usuário                             |
| POST   | `/tenants`  | não               | `createTenantSchema`       | Registrar nova empresa (tenant)               |
| POST   | `/session`  | não               | `authUserSchema`           | Autenticar usuário e obter token              |
| GET    | `/me`       | `isAuthenticated` | -                          | Detalhes do usuário autenticado               |
| POST   | `/projects` | `isAuthenticated` | `createProjectSchema`      | Criar projeto dentro da empresa               |
| POST   | `/tasks`    | `isAuthenticated` | `createTaskSchema`         | Criar tarefa associada a projeto              |

> **Nota:** Validações são feitas pelo middleware `validateSchema` usando os schemas do Zod localizados em `src/schemas`.

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

## 🧱 Estrutura de Pastas Importante

```
backend/
  src/
    controllers/      # recebem requisições e chamam services
    services/         # lógica de negócio
    schemas/          # validação de entrada
    middlewares/      # autenticação e validação
    prisma/           # inicializa Prisma Client
    routes.ts         # roteamento Express
    app.ts / server.ts# configuração e inicialização do servidor
```

---

> Este documento serve como referência rápida para desenvolvedores que transitam pelo código,
> mostrando as ligações principais entre rotas, serviços e dados.

---

*Gerado automaticamente em fevereiro de 2026.*
