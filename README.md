# Diagnóstico de Alfabetização — Quiz da Gabriela Engler

Quiz interativo (mobile-first) que diagnostica o nível de alfabetização da criança
em 5 níveis e direciona para a oferta certa.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 ·
**Mantine** (UI) · **Tabler Icons**.

## Rodar localmente

```bash
npm install
npm run dev      # http://localhost:3000
```

Outros comandos:

```bash
npm run build    # build de produção
npm run start    # serve o build de produção
```

## Estrutura

- `src/app/Quiz.tsx` — **o quiz inteiro** (client component: 24 telas, 11 perguntas,
  scoring, diagnóstico, páginas de venda).
- `src/app/page.tsx` — renderiza o `<Quiz />`.
- `src/app/layout.tsx` — `MantineProvider`, fonte DM Sans, metadados, `lang="pt-BR"`.
- `src/theme.ts` — tema Mantine com a identidade verde da Gabriela.
- `src/app/globals.css` — Tailwind + keyframes das animações.
- `src/assets/` — as 5 imagens (faixas etárias + mãe/filho).

### O que usa Mantine / Tabler
- **Mantine:** inputs (`TextInput`), botão principal (`Button`), barra de progresso
  (`Progress`), checkboxes da autoidentificação (`Checkbox`), FAQ (`Accordion`),
  botão voltar (`ActionIcon`).
- **Tabler:** ícones de chevron (voltar), check (respostas) e seta (CTA).
- O restante da UI (cards, SVGs de radar/curva, gráficos) é customizado com Tailwind +
  estilos inline para preservar a identidade visual.

## Captura de leads (Google Form)

Ao chegar na tela de projeção, o quiz envia as respostas (uma vez) para o Google Form
**"[Gabriela] Quiz de Alfabetização"** (POST `no-cors` no `formResponse`, já conectado
à planilha). A configuração fica em `src/app/Quiz.tsx`, bloco
**"Integração com o Google Form"** (URL, `entry.*`, rótulos das opções e os parâmetros
`fvv`/`pageHistory`). Não precisa de variável de ambiente.

## Deploy (GitHub + Vercel)

1. Crie um repositório no GitHub e faça push deste projeto:
   ```bash
   git add -A
   git commit -m "Quiz em Next.js + Mantine"
   git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
   git push -u origin main
   ```
2. Em [vercel.com](https://vercel.com): **Add New → Project → Import** o repositório.
3. A Vercel detecta Next.js automaticamente (Framework: Next.js). Sem config extra.
   Clique em **Deploy**.
4. Pronto: a cada `git push`, a Vercel faz deploy automático. HTTPS e domínio
   (`*.vercel.app`) já vêm prontos; dá para ligar um domínio próprio depois.
