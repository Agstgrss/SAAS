# Design System CSS - SaaS Scrum

## 📋 Visão Geral

Um sistema de design moderno e responsivo implementado com CSS puro, sem dependências de bibliotecas CSS. Está padronizado em todo o sistema para garantir consistência visual e experiência do usuário.

---

## 🎨 Cores

### Cores Primárias
- `--color-primary: #2563eb` (Azul principal)
- `--color-primary-dark: #1e40af` (Azul escuro)
- `--color-primary-light: #dbeafe` (Azul claro)

### Cores Secundárias
- `--color-secondary: #7c3aed` (Roxo)
- `--color-secondary-dark: #6d28d9` (Roxo escuro)
- `--color-secondary-light: #ede9fe` (Roxo claro)

### Cores de Status
- `--color-success: #10b981` (Verde - sucesso)
- `--color-warning: #f59e0b` (Amarelo - aviso)
- `--color-danger: #ef4444` (Vermelho - perigo)
- `--color-info: #06b6d4` (Ciano - informação)

### Escala de Cinza
Cores de `--color-gray-50` até `--color-gray-900` para fundos, bordas e textos.

---

## 🔤 Tipografia

### Tamanhos de Fonte
- `--font-size-xs: 0.75rem` (12px)
- `--font-size-sm: 0.875rem` (14px)
- `--font-size-base: 1rem` (16px)
- `--font-size-lg: 1.125rem` (18px)
- `--font-size-xl: 1.25rem` (20px)
- `--font-size-2xl: 1.5rem` (24px)
- `--font-size-3xl: 1.875rem` (30px)
- `--font-size-4xl: 2.25rem` (36px)

### Pesos de Fonte
- `--font-weight-normal: 400`
- `--font-weight-medium: 500`
- `--font-weight-semibold: 600`
- `--font-weight-bold: 700`

---

## 📏 Espaçamento

Escala consistent desde `--spacing-1` (4px) até `--spacing-20` (80px).

**Exemplos:**
- `--spacing-2: 0.5rem` (8px)
- `--spacing-4: 1rem` (16px)
- `--spacing-6: 1.5rem` (24px)

---

## 🎯 Componentes de Layout

### 1. PageWrapper
Envoltório da página inteira com altura mínima de 100vh.

```tsx
import { PageWrapper } from "@/components/layout";

<PageWrapper>
  {/* Conteúdo da página */}
</PageWrapper>
```

### 2. Header
Cabeçalho sticky com título, subtítulo e ações.

```tsx
import { Header } from "@/components/layout";

<Header
  title="Dashboard"
  subtitle="Bem-vindo!"
  actions={<Button>Ação</Button>}
  showBackButton={true}
  onBack={() => router.back()}
/>
```

### 3. Container
Contém conteúdo com largura máxima e padding automático.

```tsx
import { Container } from "@/components/layout";

<Container size="md">
  {/* Conteúdo */}
</Container>
```

### 4. Card
Cartão com sombra e padding padronizado.

```tsx
import { Card } from "@/components/layout";

<Card
  title="Titulo"
  subtitle="Subtítulo"
  footer={<Button>Ação</Button>}
>
  Conteúdo do cartão
</Card>
```

### 5. Grid
Sistema de grid responsivo com 1-3 colunas.

```tsx
import { Grid } from "@/components/layout";

<Grid cols={2} gap="6">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
</Grid>
```

### 6. FormCard
Cartão especializado para formulários.

```tsx
import { FormCard } from "@/components/layout";

<FormCard
  title="Novo Projeto"
  onSubmit={handleSubmit}
  submitButtonText="Criar"
>
  <FormField label="Nome" required>
    <input type="text" />
  </FormField>
</FormCard>
```

### 7. FormField
Wrapper para campos de formulário com label e erro.

```tsx
import { FormField } from "@/components/layout";

<FormField label="Email" error={error} required>
  <input type="email" />
</FormField>
```

### 8. Button
Botão com diferentes variações.

```tsx
import { Button } from "@/components/layout";

<Button variant="primary" size="lg" fullWidth isLoading={false}>
  Enviar
</Button>
```

**Variações:**
- `variant`: "primary" | "secondary" | "outline" | "danger" | "success"
- `size`: "sm" | "base" | "lg"

### 9. Alert
Componente de alerta com diferentes tipos.

```tsx
import { Alert } from "@/components/layout";

<Alert
  type="success"
  title="Sucesso!"
  message="Operação concluída"
  onClose={() => setAlert(null)}
/>
```

---

## 🛠️ Classes CSS Utilitárias

### Flexbox
```css
.flex { display: flex; }
.flex-col { flex-direction: column; }
.flex-center { justify-content: center; align-items: center; }
.flex-between { justify-content: space-between; align-items: center; }
```

### Gaps
```css
.gap-2 { gap: var(--spacing-2); }
.gap-4 { gap: var(--spacing-4); }
.gap-6 { gap: var(--spacing-6); }
```

### Margens
```css
.mt-4 { margin-top: var(--spacing-4); }
.mb-4 { margin-bottom: var(--spacing-4); }
```

### Padding
```css
.p-4 { padding: var(--spacing-4); }
.p-6 { padding: var(--spacing-6); }
```

### Texto
```css
.text-center { text-align: center; }
.text-muted { color: var(--color-gray-500); }
.text-success { color: var(--color-success); }
.text-danger { color: var(--color-danger); }
.font-bold { font-weight: var(--font-weight-bold); }
```

---

## 📱 Responsividade

### Breakpoints
- `--breakpoint-sm: 640px`
- `--breakpoint-md: 768px`
- `--breakpoint-lg: 1024px`
- `--breakpoint-xl: 1280px`

### Exemplo Media Query
```css
@media (max-width: 768px) {
  .grid-cols-2 {
    grid-template-columns: 1fr;
  }
}
```

---

## ⚡ Transições

- `--transition-fast: 150ms`
- `--transition-base: 200ms`
- `--transition-slow: 300ms`

**Uso:**
```css
transition: all var(--transition-base);
```

---

## 📚 Exemplos de Uso

### Login Page
```tsx
"use client";
import { PageWrapper, Container, FormCard, FormField, Button } from "@/components/layout";

export default function Login() {
  return (
    <PageWrapper>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <Container size="sm">
          <FormCard title="Login">
            <FormField label="Email" required>
              <input type="email" placeholder="email@example.com" />
            </FormField>
            <FormField label="Senha" required>
              <input type="password" />
            </FormField>
            <Button fullWidth>Entrar</Button>
          </FormCard>
        </Container>
      </div>
    </PageWrapper>
  );
}
```

### Dashboard Page
```tsx
import { PageWrapper, Header, Container, Card, Grid, Button } from "@/components/layout";

export default function Dashboard() {
  return (
    <PageWrapper>
      <Header
        title="Dashboard"
        actions={<Button onClick={logout}>Sair</Button>}
      />
      <div className="page-content">
        <Container>
          <Grid cols={3}>
            <Card title="Projetos">Seu conteúdo</Card>
            <Card title="Tarefas">Seu conteúdo</Card>
            <Card title="Usuários">Seu conteúdo</Card>
          </Grid>
        </Container>
      </div>
    </PageWrapper>
  );
}
```

---

## 🎬 Animações

### Fade In
```css
animation: fadeIn var(--transition-fast);
```

### Slide In
```css
animation: slideIn var(--transition-fast);
```

---

## ✨ Diretivas Importantes

1. **Sempre use variáveis CSS** em vez de valores hardcoded
2. **Mantenha a responsividade** usando media queries
3. **Use componentes de layout** para consistência
4. **Siga a paleta de cores** definida no design system
5. **Respeite o espaçamento padronizado** para alinhamento visual

---

## 📖 Estrutura de Arquivos

```
frontend/
├── src/
│   ├── app/
│   │   ├── globals.css          ← Design System CSS
│   │   └── layout.tsx
│   └── components/
│       └── layout/              ← Componentes exportáveis
│           ├── Header.tsx
│           ├── Container.tsx
│           ├── Card.tsx
│           ├── FormCard.tsx
│           ├── FormField.tsx
│           ├── Grid.tsx
│           ├── PageWrapper.tsx
│           ├── Button.tsx
│           ├── Alert.tsx
│           └── index.ts
```

---

## 🚀 Próximas Melhorias

- [ ] Temas escuro/claro (Dark mode)
- [ ] Variações de shadow customizáveis
- [ ] Componentes de loading spinners
- [ ] Toast notifications
- [ ] Drawer/Sidebar components
- [ ] Breadcrumb component
- [ ] Tag/Pill components
