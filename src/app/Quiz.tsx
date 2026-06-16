"use client";

import { useEffect, useMemo, useState } from "react";
import age34 from "@/assets/age-3-4.jpg";
import age3 from "@/assets/age-3.png";
import age56 from "@/assets/age-5-6.jpg";
import age78 from "@/assets/age-7-8.jpg";
import age9 from "@/assets/age-9-plus.jpg";
import motherChild from "@/assets/mother-child.jpg";
import {
  Accordion,
  ActionIcon,
  Button,
  Checkbox,
  Progress,
  TextInput,
} from "@mantine/core";
import {
  IconArrowRight,
  IconCheck,
  IconChevronLeft,
} from "@tabler/icons-react";

// ===== Theme tokens =====
const C = {
  cream: "#fdfaf5",
  mint: "#d6f2e0",
  mintLight: "#f0faf4",
  green: "#1a5c35",
  greenMid: "#2d9957",
  greenSoft: "#a8e0bc",
  warm: "#6b6b60",
  white: "#ffffff",
  red: "#d35454",
  redSoft: "#f5cfcf",
};

// ===== Questions =====
type Option = { icon: string; label: string; weight: number };
type Question = { title: string; subtitle?: string; options: Option[]; neutral?: boolean };

const QUESTIONS: Question[] = [
  {
    title: "Seu filho reconhece as letras?",
    subtitle: "Escolha a opção que mais se aproxima",
    // weight = nível da habilidade (0..4). Alfabeto vai só até 3 (teto = "conhece todas").
    options: [
      { icon: "✅", label: "Conhece todas", weight: 3 },
      { icon: "🙂", label: "Conhece a maioria", weight: 2 },
      { icon: "🔄", label: "Conhece algumas, mas confunde", weight: 1 },
      { icon: "🌱", label: "Não conhece letras", weight: 0 },
    ],
  },
  {
    title: "Seu filho conhece os sons das letras?",
    subtitle: "Mostre uma letra e peça o som, não o nome",
    // weight = nível da habilidade (0..4). Sons vai só até 3 (teto = "sabe todos").
    options: [
      { icon: "✅", label: "Sabe todos", weight: 3 },
      { icon: "🙂", label: "Sabe a maioria", weight: 2 },
      { icon: "🔄", label: "Sabe alguns sons", weight: 1 },
      { icon: "🌱", label: "Não sabe nenhum som", weight: 0 },
    ],
  },
  {
    title: "Seu filho consegue ler sílabas?",
    options: [
      { icon: "🌟", label: "Sabe ler todas as sílabas, até as complexas", weight: 4 },
      { icon: "✅", label: "Sabe ler todas as sílabas simples", weight: 3 },
      { icon: "🙂", label: "Sabe ler a maioria das sílabas", weight: 2 },
      { icon: "🔄", label: "Tenta ler, mas chuta algumas sílabas", weight: 1 },
      { icon: "🌱", label: "Não lê sílabas", weight: 0 },
    ],
  },
  {
    title: "Seu filho consegue ler palavras?",
    options: [
      { icon: "🌟", label: "Consegue ler todas as palavras", weight: 4 },
      { icon: "✅", label: "Consegue ler quase todas as palavras", weight: 3 },
      { icon: "🙂", label: "Tenta ler, mas ainda erra", weight: 2 },
      { icon: "🔄", label: "Tenta adivinhar", weight: 1 },
      { icon: "🌱", label: "Não lê palavras", weight: 0 },
    ],
  },
  {
    title: "Seu filho consegue escrever palavras?",
    options: [
      { icon: "🌟", label: "Escreve acertando praticamente tudo", weight: 4 },
      { icon: "✅", label: "Escreve acertando a maioria", weight: 3 },
      { icon: "🙂", label: "Escreve com bastante erro", weight: 2 },
      { icon: "🔄", label: "Escreve sílabas ou palavras que já memorizou", weight: 1 },
      { icon: "🌱", label: "Não escreve", weight: 0 },
    ],
  },
  {
    neutral: true,
    title: "Como seu filho se relaciona com a leitura?",
    options: [
      { icon: "❤️", label: "Adora livros e pede para ler sempre", weight: 5 },
      { icon: "😐", label: "Tem interesse mas desiste rápido quando trava", weight: 3 },
      { icon: "😔", label: "Evita ler porque se frustra", weight: 2 },
      { icon: "😶", label: "Ainda não demonstra interesse", weight: 1 },
    ],
  },
  {
    neutral: true,
    title: "Você já tentou ensinar seu filho a ler em casa?",
    options: [
      { icon: "⭐", label: "Sim e vejo progresso", weight: 5 },
      { icon: "🤔", label: "Sim mas não sei se estou fazendo certo", weight: 3 },
      { icon: "😞", label: "Tentei mas desisti", weight: 2 },
      { icon: "🆕", label: "Ainda não tentei", weight: 1 },
    ],
  },
  // Q8 — Rotina em casa
  {
    neutral: true,
    title: "Você tem uma rotina de estudos em casa com seu filho?",
    options: [
      { icon: "📅", label: "Sim, estudamos todo dia", weight: 5 },
      { icon: "🔄", label: "Às vezes, quando sobra tempo", weight: 3 },
      { icon: "😓", label: "Tento mas não consigo manter", weight: 2 },
      { icon: "🚫", label: "Ainda não temos rotina", weight: 1 },
    ],
  },
  // Q9 — Método fônico
  {
    neutral: true,
    title: "Você já conhece ou já usou a instrução fônica?",
    options: [
      { icon: "🏆", label: "Sim, já uso e quero me aprofundar", weight: 5 },
      { icon: "👀", label: "Já ouvi falar mas nunca usei", weight: 3 },
      { icon: "🔄", label: "Já tentei mas tive dificuldades", weight: 2 },
      { icon: "🆕", label: "Nunca ouvi falar", weight: 1 },
    ],
  },
  // Q10 — Escola
  {
    neutral: true,
    title: "Como está o desempenho do seu filho na escola em relação à leitura?",
    options: [
      { icon: "⭐", label: "Está indo bem, acima da turma", weight: 5 },
      { icon: "📊", label: "Está na média da turma", weight: 3 },
      { icon: "⚠️", label: "Está abaixo da turma", weight: 2 },
      { icon: "🏫", label: "A escola ainda não identificou a dificuldade", weight: 1 },
    ],
  },
  // Q11 — Emoção
  {
    neutral: true,
    title: "Como seu filho reage quando encontra dificuldade na leitura?",
    options: [
      { icon: "💪", label: "Persiste e tenta de novo", weight: 5 },
      { icon: "😤", label: "Fica frustrado mas continua", weight: 3 },
      { icon: "😢", label: "Chora ou demonstra tristeza", weight: 2 },
      { icon: "🚪", label: "Desiste e evita tentar", weight: 1 },
    ],
  },
];

// ===== Popups de feedback por resposta (idade × pergunta × nível) =====
// Aparecem após responder uma das 5 perguntas-métrica (qIndex 0..4).
// Chave: POPUP_TEXTS[idade][qIndex][nível escolhido] = frase.
// qIndex: 0=Alfabeto · 1=Sons · 2=Leitura(sílabas) · 3=Leitura(palavras) · 4=Escrita
const POPUP_TEXTS: Record<string, Record<number, Record<number, string>>> = {
  "0-2": {
    0: { 0: "Isso é o esperado para a idade", 1: "Isso é um ótimo sinal!", 2: "Isso é ótimo, seu filho está avançado!", 3: "Isso é extraordinário! Seu filho está bem avançado.", 4: "Isso é extraordinário! Seu filho está bem avançado." },
    1: { 0: "Seu filho já poderia aprender todos os sonzinhos!", 1: "Seu filho já poderia aprender todos os sonzinhos!", 2: "Seu filho já poderia aprender todos os sonzinhos!", 3: "Muito bom. É preciso praticar todos os dias!", 4: "Muito bom. É preciso praticar todos os dias!" },
    2: { 0: "Isso é o esperado para a idade", 1: "Isso é um ótimo sinal!", 2: "Isso é ótimo, seu filho está avançado!", 3: "Isso é extraordinário! Seu filho está bem avançado.", 4: "Isso é extraordinário! Seu filho está bem avançado." },
    3: { 0: "Isso é o esperado para a idade", 1: "Isso é um ótimo sinal!", 2: "Isso é ótimo, seu filho está avançado!", 3: "Isso é extraordinário! Seu filho está bem avançado.", 4: "Isso é extraordinário! Seu filho está bem avançado." },
    4: { 0: "Isso é o esperado para a idade", 1: "Isso é ótimo, seu filho está avançado!", 2: "Isso é extraordinário! Seu filho está bem avançado.", 3: "Isso é extraordinário! Seu filho está bem avançado.", 4: "Isso é extraordinário! Seu filho está bem avançado." },
  },
  "3": {
    0: { 0: "Seu filho já poderia conhecer as vogais…", 1: "Isso é o esperado para a idade", 2: "Isso é um ótimo sinal!", 3: "Isso é ótimo, seu filho está avançado!", 4: "Isso é ótimo, seu filho está avançado!" },
    1: { 0: "Seu filho já poderia saber todos os sonzinhos…", 1: "Seu filho já poderia saber todos os sonzinhos…", 2: "Seu filho já poderia saber todos os sonzinhos…", 3: "Isso é o esperado para a idade", 4: "Isso é o esperado para a idade" },
    2: { 0: "Seu filho já poderia ler sílabas com as vogais… (ia, eu)", 1: "Isso é o esperado para a idade", 2: "Isso é um ótimo sinal!", 3: "Isso é ótimo, seu filho está avançado!", 4: "Isso é extraordinário! Seu filho está bem avançado." },
    3: { 0: "Seu filho já poderia ler palavras com as vogais… (ioiô, au)", 1: "Isso é o esperado para a idade", 2: "Isso é um ótimo sinal!", 3: "Isso é ótimo, seu filho está avançado!", 4: "Isso é extraordinário! Seu filho está bem avançado." },
    4: { 0: "Seu filho já poderia escrever palavras com as vogais… (ai, oi, ioiô)", 1: "Isso é o esperado para a idade", 2: "Isso é um ótimo sinal!", 3: "Isso é ótimo, seu filho está avançado!", 4: "Isso é extraordinário! Seu filho está bem avançado." },
  },
  "4": {
    0: { 0: "Seu filho já poderia saber todo o alfabeto", 1: "Seu filho já poderia saber todo o alfabeto", 2: "Isso é o esperado para a idade", 3: "Isso é ótimo, seu filho está avançado!", 4: "Isso é ótimo, seu filho está avançado!" },
    1: { 0: "Seu filho já poderia saber todos os sonzinhos…", 1: "Seu filho já poderia saber todos os sonzinhos…", 2: "Seu filho já poderia saber todos os sonzinhos…", 3: "Isso é o esperado para a idade", 4: "Isso é o esperado para a idade" },
    2: { 0: "Seu filho já poderia ler sílabas simples (ma, xu, zi)", 1: "Seu filho já poderia ler sílabas simples", 2: "Isso é o esperado para a idade", 3: "Isso é ótimo, seu filho está avançado!", 4: "Isso é extraordinário! Seu filho está bem avançado." },
    3: { 0: "Seu filho já poderia ler palavras simples… (mala, dado)", 1: "Seu filho já poderia ler palavras simples… (mala, dado)", 2: "Isso é o esperado para a idade", 3: "Isso é ótimo, seu filho está avançado!", 4: "Isso é extraordinário! Seu filho está bem avançado." },
    4: { 0: "Seu filho já poderia escrever palavras simples… (mala, dado)", 1: "Seu filho já poderia escrever palavras simples… (mala, dado)", 2: "Isso é o esperado para a idade", 3: "Isso é ótimo, seu filho está avançado!", 4: "Isso é extraordinário! Seu filho está bem avançado." },
  },
  "5-6": {
    0: { 0: "Seu filho já poderia saber todo o alfabeto", 1: "Seu filho já poderia saber todo o alfabeto", 2: "Seu filho já poderia saber todo o alfabeto", 3: "Isso é o esperado para a idade" },
    1: { 0: "Seu filho já poderia saber todos os sonzinhos…", 1: "Seu filho já poderia saber todos os sonzinhos…", 2: "Seu filho já poderia saber todos os sonzinhos…", 3: "Isso é o esperado para a idade" },
    2: { 0: "Seu filho já poderia ler sílabas", 1: "Seu filho já poderia ler sílabas", 2: "Seu filho já poderia ler sílabas", 3: "Isso é o esperado para a idade", 4: "Isso é ótimo, seu filho está avançado!" },
    3: { 0: "Seu filho já poderia ler palavras", 1: "Seu filho já poderia ler palavras", 2: "Seu filho já poderia ler palavras", 3: "Isso é o esperado para a idade", 4: "Isso é ótimo, seu filho está avançado!" },
    4: { 0: "Seu filho já poderia saber escrever", 1: "Seu filho já poderia saber escrever", 2: "Seu filho já poderia saber escrever", 3: "Isso é o esperado para a idade", 4: "Isso é ótimo, seu filho está avançado!" },
  },
  "7+": {
    0: { 0: "Seu filho já poderia saber todo o alfabeto", 1: "Seu filho já poderia saber todo o alfabeto", 2: "Seu filho já poderia saber todo o alfabeto", 3: "Isso é o esperado para a idade" },
    1: { 0: "Seu filho já poderia saber todos os sonzinhos…", 1: "Seu filho já poderia saber todos os sonzinhos…", 2: "Seu filho já poderia saber todos os sonzinhos…", 3: "Isso é o esperado para a idade" },
    2: { 0: "Seu filho já poderia ler sílabas complexas", 1: "Seu filho já poderia ler sílabas complexas", 2: "Seu filho já poderia ler sílabas complexas", 3: "Seu filho já poderia ler sílabas complexas", 4: "Isso é o esperado para a idade" },
    3: { 0: "Seu filho já poderia ler quase todas as palavras", 1: "Seu filho já poderia ler quase todas as palavras", 2: "Seu filho já poderia ler quase todas as palavras", 3: "Seu filho já poderia ler quase todas as palavras", 4: "Isso é o esperado para a idade" },
    4: { 0: "Seu filho já poderia dominar as regras ortográficas", 1: "Seu filho já poderia dominar as regras ortográficas", 2: "Seu filho já poderia dominar as regras ortográficas", 3: "Seu filho já poderia dominar as regras ortográficas", 4: "Isso é o esperado para a idade" },
  },
};

// ===== Screen flow =====
type ScreenType =
  | "age" | "social" | "benefit" | "name" | "whatsapp" | "instagram"
  | "question" | "interstitial" | "interstitial2" | "stat"
  | "processing" | "result" | "sales";

type Screen = { type: ScreenType; qIndex?: number };

const SCREENS: Screen[] = [
  { type: "age" },           // 0
  { type: "social" },        // 1
  { type: "benefit" },       // 2
  { type: "name" },          // 3
  { type: "whatsapp" },      // 4
  { type: "instagram" },     // 5
  { type: "question", qIndex: 0 },   // 6  — Q1
  { type: "question", qIndex: 1 },   // 7  — Q2
  { type: "interstitial" },          // 8
  { type: "question", qIndex: 2 },   // 9  — Q3
  { type: "question", qIndex: 3 },   // 10 — Q4
  { type: "stat" },                  // 11
  { type: "question", qIndex: 4 },   // 12 — Q5
  { type: "question", qIndex: 5 },   // 13 — Q6
  { type: "question", qIndex: 6 },   // 14 — Q7
  { type: "question", qIndex: 7 },   // 15 — Q8
  { type: "question", qIndex: 8 },   // 16 — Q9
  { type: "interstitial2" },         // 17 — entre Q9 e Q10
  { type: "question", qIndex: 9 },   // 18 — Q10
  { type: "question", qIndex: 10 },  // 19 — Q11
  { type: "processing" },            // 20
  { type: "result" },                // 21 — última tela (versão alunas: sem pitch)
];

const TOTAL_QUESTIONS = QUESTIONS.length; // 11

const LEVEL_TEXTS: Record<number, { name: string; tagColor: string; diag: string; pitch: string }> = {
  0: {
    name: "Nível 0 — Pré-leitor",
    tagColor: "#e89a8c",
    diag: "Seu filho está no início da jornada. E isso é ótimo. Não há atraso — há uma oportunidade enorme de construir uma base sólida desde o começo, do jeito certo.",
    pitch: "Na masterclass você vai aprender exatamente por onde começar, os primeiros sons que ele precisa dominar e como criar uma rotina de 15 minutos que vai funcionar desde o primeiro dia.",
  },
  1: {
    name: "Nível 1 — Iniciante",
    tagColor: "#f0b27a",
    diag: "Seu filho deu o primeiro passo. Agora precisa do método certo para avançar. Reconhecer a letra não é o mesmo que saber o som dela — e essa é a etapa onde a maioria das crianças trava.",
    pitch: "Na masterclass você vai entender o que está faltando para seu filho avançar da fase das letras para a fase da leitura.",
  },
  2: {
    name: "Nível 2 — Em desenvolvimento",
    tagColor: "#f4d35e",
    diag: "Seu filho está quase lá. Ele só precisa de um empurrão no lugar certo. O desafio agora é a junção: transformar sons em sílabas e sílabas em palavras.",
    pitch: "Na masterclass você vai aprender como guiar seu filho nessa transição com a sequência certa e atividades práticas.",
  },
  3: {
    name: "Nível 3 — Leitor em progresso",
    tagColor: "#a8e0bc",
    diag: "Seu filho já lê. Agora é hora de ganhar fluidez e confiança. Ler soletrando ainda gera frustração — o próximo passo é automatizar o que ele já sabe.",
    pitch: "Na masterclass você vai aprender como ajudar seu filho a passar de leitura lenta para uma leitura fluente.",
  },
  4: {
    name: "Nível 4 — Leitor em consolidação",
    tagColor: "#1a5c35",
    diag: "Seu filho já é um leitor. Agora vamos consolidar essa habilidade. Os erros pontuais que ainda aparecem têm solução específica.",
    pitch: "Na masterclass você vai aprender como identificar e trabalhar as lacunas específicas do seu filho.",
  },
};

// ===== "Próximos passos" — plano de ação por idade × nível =====
type StepSection = { label: string; text: string; bullets?: string[] };
type NextStep = { steps: StepSection[]; promise?: string; cta?: boolean };

// Trechos reaproveitados entre várias faixas/níveis.
const S_CF = "Ensine os sonzinhos da fala, 1 por dia, com as fichas dos sons e brincadeiras lúdicas. Diga palavras enfatizando o som inicial e peça para a criança repetir.";
const S_PA_F = "Mostre que as letras fazem sons. Por exemplo: “A letra F faz o som ‘fff’, como o de apagar o fogo.”";
const S_PA_SIS = "Ensine de forma sistemática que as letras fazem sons. Por exemplo: “A letra F faz o som ‘fff’, como o de apagar o fogo.”";
const S_ESCRITA_VELA = "Ensine o traçado em letra bastão de cada letra, conforme o padrão, e a escrever palavrinhas. Dite palavras pronunciando os sons devagar, como “vvvveeeellla”, para a criança escrever.";
const S_LEITURA_2SIL = "A prática é a sua principal aliada agora. Pratique a leitura de palavras de 2 sílabas com consoantes de sons longos. Depois, aumente a dificuldade com palavras mais longas ou com consoantes de sons curtos. Selecione bem as palavras: não apresente uma palavra complexa sem antes ensinar a regra ortográfica por trás dela. Por exemplo, não mostre “anjo” antes de ensinar que o N pode nasalizar o som da vogal A. Introduza as sílabas mais complexas aos poucos, sempre de forma explícita.";
const S_ESCRITA_SACOLA = "Pratique o traçado em letra bastão e cursiva de cada letra, conforme o padrão, e a escrita de palavras ditadas. Dite palavras pronunciando os sons devagar, como “sacola”, para a criança escrever.";
const ORTHO_RULES = [
  "Vogais nasais (Am, An, Em, En, etc.)",
  "Lh, Nh, Ch",
  "L com som [u]",
  "C com som [s]",
  "Ç",
  "G com som de J",
  "Uso do GU",
  "Uso do QU",
  "Os sons da letra R",
  "O RR",
  "S com som [z]",
  "O SS",
  "Os sons da letra X",
];
const S_PROMISE_SIMPLES = "Com 15 minutos por dia, em 3 meses seu filho será capaz de ler e escrever palavras simples.";
const S_PROMISE_AMPLA = "Com 15 minutos por dia, em 3 meses seu filho será capaz de ler e escrever uma ampla variedade de palavras.";

// Cada faixa tem uma lista de textos; NEXT_STEPS_INDEX[idade][nível 0..4] aponta qual texto usar.
const NEXT_STEPS: Record<string, NextStep[]> = {
  "0-2": [
    {
      steps: [
        {
          label: "Consciência Fonêmica",
          text: "Ensinar todos os sonzinhos da fala. Você pode ensinar 1 sonzinho por dia. Utilize as fichas dos sons e faça brincadeiras relacionadas, para que o ensino seja lúdico. Diga palavras dando ênfase no sonzinho inicial, para que a criança repita. Trabalhe as seguintes habilidades:",
          bullets: [
            "Identificar o sonzinho inicial das palavras",
            "Juntar sonzinhos e formar palavras",
            "Dividir uma palavra em seus sonzinhos",
            "Manipular sonzinhos entre palavras",
          ],
        },
      ],
      promise: "Se você fizer 15 minutos por dia, seu filho aprenderá todos os sonzinhos em menos de 3 meses.",
      cta: true,
    },
    {
      steps: [
        {
          label: "Consciência Fonêmica",
          text: "Ensinar todos os sonzinhos da fala. Você pode ensinar 1 sonzinho por dia. Utilize as fichas dos sons e faça brincadeiras relacionadas, para que o ensino seja lúdico. Diga palavras dando ênfase no sonzinho inicial, para que a criança repita. Trabalhe as seguintes habilidades:",
          bullets: [
            "Identificar o sonzinho inicial das palavras",
            "Juntar sonzinhos e formar palavras",
            "Dividir uma palavra em seus sonzinhos",
            "Manipular sonzinhos entre palavras",
          ],
        },
        { label: "Princípio Alfabético", text: "Ensinar que as letras fazem sons. Comece pelas 5 vogais e seus 7 sons orais: A (ááá), E (ééé, êêê), I (iii), O (óóó, ôôô) e U (uuu). Diga, por exemplo: “A letra U faz o som ‘uuuu’, como o macaquinho.”" },
        { label: "Leitura", text: "Antes de ler, a criança deve saber juntar os sonzinhos por meio das fichas. Comece incentivando a criança a ler palavras formadas somente por vogais: ai, oi, ui, etc. Passe o dedo por cima de cada letra, pronunciando o seu sonzinho vagarosamente; depois, diga a sílaba/palavra formada de forma contínua." },
        { label: "Escrita", text: "Ensinar o traçado bastão de cada vogal, conforme o padrão. Ensinar a escrever palavrinhas somente com vogais. O adulto deve ditar palavras como “ai, oi, ioiô, ui, eu” e a criança deve ser capaz de escrever." },
      ],
      promise: "Se você fizer 15 minutos por dia, seu filho aprenderá todos os sonzinhos e relacionará às letras em menos de 2 meses. Ele também aprenderá a ler e escrever com as vogais.",
      cta: true,
    },
    {
      steps: [
        {
          label: "Consciência Fonêmica",
          text: "Ensinar todos os sonzinhos da fala com as fichas dos sons. Trabalhe as seguintes habilidades:",
          bullets: [
            "Identificar o sonzinho inicial das palavras",
            "Juntar sonzinhos e formar palavras",
            "Dividir uma palavra em seus sonzinhos",
            "Manipular sonzinhos entre palavras",
          ],
        },
        { label: "Princípio Alfabético", text: "Relacionar cada sonzinho a uma letra. Ensinar que as letras fazem sons. Diga, por exemplo: “A letra F faz o som ‘fff’, como o de apagar o fogo.”" },
        { label: "Leitura", text: "A prática diária da leitura é a principal aliada nesse momento. Pratique a leitura de palavras simples. Depois, aumente a dificuldade de forma sistemática. É importante selecionar bem as palavras. Não apresente palavras complexas sem antes ensinar a regra ortográfica. Por exemplo, não apresente a palavra “anjo” se ainda não foi ensinado que a consoante N pode nasalizar o som da vogal A." },
        { label: "Escrita", text: "Praticar o traçado bastão e cursivo de cada letra, conforme o padrão. Praticar a escrita de palavras ditadas. O adulto deve ditar palavras como “sacola”, pronunciando os sons vagarosamente, e a criança deve ser capaz de escrever." },
      ],
      promise: "Se você fizer 15 minutos todos os dias, seu filho poderá ser capaz de ler e escrever uma ampla quantidade de palavras em 3 meses.",
      cta: true,
    },
    {
      steps: [
        { label: "Princípio Alfabético", text: "Relacionar cada sonzinho a uma letra. Ensinar que as letras fazem sons. Diga, por exemplo: “A letra F faz o som ‘fff’, como o de apagar o fogo.”" },
        { label: "Regras ortográficas", text: "Ensine as relações complexas entre letras e sons. Por exemplo, a letra C pode fazer o som “k-k-k” e “sss”. O ensino deve ser explícito e lúdico. Ensine 1 regra ortográfica por semana. Algumas estão listadas abaixo:", bullets: ORTHO_RULES },
        { label: "Leitura", text: "Continue praticando a leitura de palavras simples. À medida que as regras ortográficas são ensinadas, pratique a leitura de palavras complexas e de pequenos textos." },
      ],
      cta: true,
    },
  ],
  "3": [
    {
      steps: [
        {
          label: "Consciência Fonêmica",
          text: "Ensinar todos os sonzinhos da fala. Você pode ensinar 1 sonzinho por dia. Utilize as fichas dos sons e faça brincadeiras relacionadas, para que o ensino seja lúdico. Trabalhe as seguintes habilidades:",
          bullets: [
            "Identificar o sonzinho inicial das palavras",
            "Juntar sonzinhos e formar palavras",
            "Dividir uma palavra em seus sonzinhos",
            "Manipular sonzinhos entre palavras",
          ],
        },
        { label: "Princípio Alfabético", text: "Ensinar que as letras fazem sons. Comece pelas 5 vogais e seus 7 sons orais: A (ááá), E (ééé, êêê), I (iii), O (óóó, ôôô) e U (uuu). Diga, por exemplo: “A letra U faz o som ‘uuuu’, como o macaquinho.”" },
        { label: "Leitura", text: "Antes de ler, a criança deve saber juntar os sonzinhos por meio das fichas. Comece incentivando a criança a ler palavras formadas somente por vogais: ai, oi, ui, etc. Passe o dedo por cima de cada letra, pronunciando o seu sonzinho vagarosamente; depois, diga a sílaba/palavra formada de forma contínua." },
        { label: "Escrita", text: "Ensinar o traçado bastão de cada vogal, conforme o padrão. Ensinar a escrever palavrinhas somente com vogais. O adulto deve ditar palavras como “ai, oi, ioiô, ui, eu” e a criança deve ser capaz de escrever." },
      ],
      promise: "Se você fizer 15 minutos todos os dias, seu filho poderá ser capaz de ler e escrever com as vogais e conhecerá todos os sonzinhos em 3 meses.",
      cta: true,
    },
    {
      steps: [
        {
          label: "Consciência Fonêmica",
          text: "Ensinar todos os sonzinhos da fala com as fichas dos sons. Trabalhe as seguintes habilidades:",
          bullets: [
            "Identificar o sonzinho inicial das palavras",
            "Juntar sonzinhos e formar palavras",
            "Dividir uma palavra em seus sonzinhos",
            "Manipular sonzinhos entre palavras",
          ],
        },
        { label: "Princípio Alfabético", text: "Relacionar cada sonzinho a uma letra. Ensinar que as letras fazem sons. Diga, por exemplo: “A letra F faz o som ‘fff’, como o de apagar o fogo.”" },
        { label: "Leitura", text: "Antes de ler, a criança deve saber juntar os sonzinhos por meio das fichas. Comece incentivando a criança a ler palavras formadas somente por vogais: ai, oi, ui, etc. Depois, introduza as consoantes, formando sílabas. Passe o dedo por cima de cada letra, pronunciando o seu sonzinho vagarosamente; depois, diga a sílaba/palavra formada de forma contínua." },
        { label: "Escrita", text: "Ensinar o traçado bastão de cada letra, conforme o padrão. Ensinar a escrever sílabas e, depois, palavrinhas. O adulto deve ditar palavras como “vvvveeeellla”, pronunciando os sons vagarosamente, e a criança deve ser capaz de escrever." },
      ],
      promise: "Se você fizer 15 minutos todos os dias, seu filho poderá ser capaz de ler e escrever palavras simples em 3 meses.",
      cta: true,
    },
    {
      steps: [
        {
          label: "Consciência Fonêmica",
          text: "Ensinar todos os sonzinhos da fala com as fichas dos sons. Trabalhe as seguintes habilidades:",
          bullets: [
            "Identificar o sonzinho inicial das palavras",
            "Juntar sonzinhos e formar palavras",
            "Dividir uma palavra em seus sonzinhos",
            "Manipular sonzinhos entre palavras",
          ],
        },
        { label: "Princípio Alfabético", text: "Relacionar cada sonzinho a uma letra. Ensinar que as letras fazem sons. Diga, por exemplo: “A letra F faz o som ‘fff’, como o de apagar o fogo.”" },
        { label: "Leitura", text: "A prática diária da leitura é a principal aliada nesse momento. Pratique a leitura de palavras simples. Depois, aumente a dificuldade de forma sistemática. É importante selecionar bem as palavras. Não apresente palavras complexas sem antes ensinar a regra ortográfica. Por exemplo, não apresente a palavra “anjo” se ainda não foi ensinado que a consoante N pode nasalizar o som da vogal A." },
        { label: "Escrita", text: "Praticar o traçado bastão e cursivo de cada letra, conforme o padrão. Praticar a escrita de palavras ditadas. O adulto deve ditar palavras como “sacola”, pronunciando os sons vagarosamente, e a criança deve ser capaz de escrever." },
      ],
      promise: "Se você fizer 15 minutos todos os dias, seu filho poderá ser capaz de ler e escrever uma ampla quantidade de palavras em 3 meses.",
      cta: true,
    },
    {
      steps: [
        { label: "Princípio Alfabético", text: "Relacionar cada sonzinho a uma letra. Ensinar que as letras fazem sons. Diga, por exemplo: “A letra F faz o som ‘fff’, como o de apagar o fogo.”" },
        { label: "Regras ortográficas", text: "Ensine as relações complexas entre letras e sons. Por exemplo, a letra C pode fazer o som “k-k-k” e “sss”. O ensino deve ser explícito e lúdico. Ensine 1 regra ortográfica por semana. Algumas estão listadas abaixo:", bullets: ORTHO_RULES },
        { label: "Leitura", text: "Continue praticando a leitura de palavras simples. À medida que as regras ortográficas são ensinadas, pratique a leitura de palavras complexas e de pequenos textos. Não force que a criança leia palavras complexas sem antes ensinar a regra ortográfica de forma clara." },
        { label: "Escrita", text: "Continue praticando o traçado bastão e cursivo de cada letra, conforme o padrão. Praticar a escrita de palavras ditadas. O adulto deve ditar palavras mais complexas à medida que a criança aprende as regras ortográficas." },
      ],
      promise: "Se você fizer 15 minutos todos os dias, seu filho poderá ser capaz de ler e escrever palavras complexas em 3 meses.",
      cta: true,
    },
  ],
  "5-6": [
    {
      steps: [
        {
          label: "Consciência Fonêmica",
          text: "Ensinar todos os sonzinhos da fala com as fichas dos sons. Trabalhe as seguintes habilidades:",
          bullets: [
            "Identificar o sonzinho inicial das palavras",
            "Juntar sonzinhos e formar palavras",
            "Dividir uma palavra em seus sonzinhos",
            "Manipular sonzinhos entre palavras",
          ],
        },
        { label: "Princípio Alfabético", text: "Relacionar cada sonzinho a uma letra. Ensinar que as letras fazem sons. Diga, por exemplo: “A letra F faz o som ‘fff’, como o de apagar o fogo.”" },
        { label: "Leitura", text: "Antes de ler, a criança deve saber juntar os sonzinhos por meio das fichas. Comece incentivando a criança a ler palavras formadas somente por vogais: ai, oi, ui, etc. Depois, introduza as consoantes, formando sílabas. Passe o dedo por cima de cada letra, pronunciando o seu sonzinho vagarosamente; depois, diga a sílaba/palavra formada de forma contínua." },
        { label: "Escrita", text: "Ensinar o traçado bastão de cada letra, conforme o padrão. Ensinar a escrever sílabas e, depois, palavrinhas. O adulto deve ditar palavras como “vvvveeeellla”, pronunciando os sons vagarosamente, e a criança deve ser capaz de escrever." },
      ],
      promise: "Se você fizer 15 minutos todos os dias, seu filho poderá ser capaz de ler e escrever palavras simples em 3 meses.",
      cta: true,
    },
    {
      steps: [
        {
          label: "Consciência Fonêmica",
          text: "Ensinar todos os sonzinhos da fala com as fichas dos sons. Trabalhe as seguintes habilidades:",
          bullets: [
            "Identificar o sonzinho inicial das palavras",
            "Juntar sonzinhos e formar palavras",
            "Dividir uma palavra em seus sonzinhos",
            "Manipular sonzinhos entre palavras",
          ],
        },
        { label: "Princípio Alfabético", text: "Relacionar cada sonzinho a uma letra. Ensinar que as letras fazem sons. Diga, por exemplo: “A letra F faz o som ‘fff’, como o de apagar o fogo.”" },
        { label: "Leitura", text: "A prática diária da leitura é a principal aliada nesse momento. Pratique a leitura de palavras simples. Depois, aumente a dificuldade de forma sistemática. É importante selecionar bem as palavras. Não apresente palavras complexas sem antes ensinar a regra ortográfica. Por exemplo, não apresente a palavra “anjo” se ainda não foi ensinado que a consoante N pode nasalizar o som da vogal A." },
        { label: "Escrita", text: "Praticar o traçado bastão e cursivo de cada letra, conforme o padrão. Praticar a escrita de palavras ditadas. O adulto deve ditar palavras como “sacola”, pronunciando os sons vagarosamente, e a criança deve ser capaz de escrever." },
      ],
      promise: "Se você fizer 15 minutos todos os dias, seu filho poderá ser capaz de ler e escrever uma ampla quantidade de palavras em 3 meses.",
      cta: true,
    },
    {
      steps: [
        { label: "Princípio Alfabético", text: "Relacionar cada sonzinho a uma letra. Ensinar que as letras fazem sons. Diga, por exemplo: “A letra F faz o som ‘fff’, como o de apagar o fogo.”" },
        { label: "Regras ortográficas", text: "Ensine as relações complexas entre letras e sons. Por exemplo, a letra C pode fazer o som “k-k-k” e “sss”. O ensino deve ser explícito e lúdico. Ensine 1 regra ortográfica por semana. Algumas estão listadas abaixo:", bullets: ORTHO_RULES },
        { label: "Leitura", text: "Continue praticando a leitura de palavras simples. À medida que as regras ortográficas são ensinadas, pratique a leitura de palavras complexas e de pequenos textos. Não force que a criança leia palavras complexas sem antes ensinar a regra ortográfica de forma clara." },
        { label: "Escrita", text: "Continue praticando o traçado bastão e cursivo de cada letra, conforme o padrão. Praticar a escrita de palavras ditadas. O adulto deve ditar palavras mais complexas à medida que a criança aprende as regras ortográficas." },
      ],
      promise: "Se você fizer 15 minutos todos os dias, seu filho poderá ser capaz de ler e escrever palavras complexas em 3 meses.",
      cta: true,
    },
    {
      steps: [
        { label: "Princípio Alfabético", text: "Relacionar cada sonzinho a uma letra. Ensinar que as letras fazem sons. Diga, por exemplo: “A letra F faz o som ‘fff’, como o de apagar o fogo.”" },
        { label: "Regras ortográficas", text: "Continue praticando as relações complexas entre letras e sons. Por exemplo, a letra C pode fazer o som “k-k-k” e “sss”. O ensino deve ser explícito e lúdico. Relembre 2 regras ortográficas por semana. Algumas estão listadas abaixo:", bullets: ORTHO_RULES },
        { label: "Leitura", text: "A criança deve alcançar a prosódia, a velocidade e a fluência na leitura. Para isso, continue praticando a leitura de palavras complexas. Pratique a leitura oral de textos todos os dias. A leitura repetida é uma aliada nesse momento, auxiliando a criança a tornar a leitura automática." },
        { label: "Escrita", text: "Continue praticando o traçado cursivo de cada letra, conforme o padrão. Trabalhe a escrita de pequenos textos, pelo menos 3× por semana, prezando pela ortografia e gramática." },
      ],
      promise: "Se você fizer 15 minutos todos os dias, seu filho poderá ser capaz de ler com fluência, velocidade e prosódia e de escrever pequenos textos em 3 meses.",
      cta: true,
    },
  ],
  "7+": [
    {
      steps: [
        {
          label: "Consciência Fonêmica",
          text: "Ensinar todos os sonzinhos da fala com as fichas dos sons. Trabalhe as seguintes habilidades:",
          bullets: [
            "Identificar o sonzinho inicial das palavras",
            "Juntar sonzinhos e formar palavras",
            "Dividir uma palavra em seus sonzinhos",
            "Manipular sonzinhos entre palavras",
          ],
        },
        { label: "Princípio Alfabético", text: "Relacionar cada sonzinho a uma letra. Ensinar que as letras fazem sons. Diga, por exemplo: “A letra F faz o som ‘fff’, como o de apagar o fogo.”" },
        { label: "Leitura", text: "Antes de ler, a criança deve saber juntar os sonzinhos por meio das fichas. Comece incentivando a criança a ler palavras formadas somente por vogais: ai, oi, ui, etc. Depois, introduza as consoantes, formando sílabas. Passe o dedo por cima de cada letra, pronunciando o seu sonzinho vagarosamente; depois, diga a sílaba/palavra formada de forma contínua." },
        { label: "Escrita", text: "Ensinar o traçado bastão de cada letra, conforme o padrão. Ensinar a escrever sílabas e, depois, palavrinhas. O adulto deve ditar palavras como “vvvveeeellla”, pronunciando os sons vagarosamente, e a criança deve ser capaz de escrever." },
      ],
      promise: "Se você fizer 15 minutos todos os dias, seu filho poderá ser capaz de ler e escrever palavras simples em 3 meses.",
      cta: true,
    },
    {
      steps: [
        {
          label: "Consciência Fonêmica",
          text: "Ensinar todos os sonzinhos da fala com as fichas dos sons. Trabalhe as seguintes habilidades:",
          bullets: [
            "Identificar o sonzinho inicial das palavras",
            "Juntar sonzinhos e formar palavras",
            "Dividir uma palavra em seus sonzinhos",
            "Manipular sonzinhos entre palavras",
          ],
        },
        { label: "Princípio Alfabético", text: "Relacionar cada sonzinho a uma letra. Ensinar que as letras fazem sons. Diga, por exemplo: “A letra F faz o som ‘fff’, como o de apagar o fogo.”" },
        { label: "Leitura", text: "A prática diária da leitura é a principal aliada nesse momento. Pratique a leitura de palavras simples. Depois, aumente a dificuldade de forma sistemática. É importante selecionar bem as palavras. Não apresente palavras complexas sem antes ensinar a regra ortográfica. Por exemplo, não apresente a palavra “anjo” se ainda não foi ensinado que a consoante N pode nasalizar o som da vogal A." },
        { label: "Escrita", text: "Praticar o traçado bastão e cursivo de cada letra, conforme o padrão. Praticar a escrita de palavras ditadas. O adulto deve ditar palavras como “sacola”, pronunciando os sons vagarosamente, e a criança deve ser capaz de escrever." },
      ],
      promise: "Se você fizer 15 minutos todos os dias, seu filho poderá ser capaz de ler e escrever uma ampla quantidade de palavras em 3 meses.",
      cta: true,
    },
    {
      steps: [
        { label: "Princípio Alfabético", text: "Relacionar cada sonzinho a uma letra. Ensinar que as letras fazem sons. Diga, por exemplo: “A letra F faz o som ‘fff’, como o de apagar o fogo.”" },
        { label: "Regras ortográficas", text: "Ensine as relações complexas entre letras e sons. Por exemplo, a letra C pode fazer o som “k-k-k” e “sss”. O ensino deve ser explícito e lúdico. Ensine 1 regra ortográfica por semana. Algumas estão listadas abaixo:", bullets: ORTHO_RULES },
        { label: "Leitura", text: "Continue praticando a leitura de palavras simples. À medida que as regras ortográficas são ensinadas, pratique a leitura de palavras complexas e de pequenos textos. Não force que a criança leia palavras complexas sem antes ensinar a regra ortográfica de forma clara." },
        { label: "Escrita", text: "Continue praticando o traçado bastão e cursivo de cada letra, conforme o padrão. Praticar a escrita de palavras ditadas. O adulto deve ditar palavras mais complexas à medida que a criança aprende as regras ortográficas." },
      ],
      promise: "Se você fizer 15 minutos todos os dias, seu filho poderá ser capaz de ler e escrever palavras complexas em 3 meses.",
      cta: true,
    },
    {
      steps: [
        { label: "Princípio Alfabético", text: "Relacionar cada sonzinho a uma letra. Ensinar que as letras fazem sons. Diga, por exemplo: “A letra F faz o som ‘fff’, como o de apagar o fogo.”" },
        { label: "Regras ortográficas", text: "Continue praticando as relações complexas entre letras e sons. Por exemplo, a letra C pode fazer o som “k-k-k” e “sss”. O ensino deve ser explícito e lúdico. Relembre 2 regras ortográficas por semana. Algumas estão listadas abaixo:", bullets: ORTHO_RULES },
        { label: "Leitura", text: "A criança deve alcançar a prosódia, a velocidade e a fluência na leitura. Para isso, continue praticando a leitura de palavras complexas. Pratique a leitura oral de textos todos os dias. A leitura repetida é uma aliada nesse momento, auxiliando a criança a tornar a leitura automática." },
        { label: "Escrita", text: "Continue praticando o traçado cursivo de cada letra, conforme o padrão. Trabalhe a escrita de pequenos textos, pelo menos 3× por semana, prezando pela ortografia e gramática." },
      ],
      promise: "Se você fizer 15 minutos todos os dias, seu filho poderá ser capaz de ler com fluência, velocidade e prosódia e de escrever pequenos textos em 3 meses.",
      cta: true,
    },
  ],
};
// Faixa "4" reusa os 4 planos da faixa "3" e adiciona um 5º plano (consolidação/fluência) só para o nível mais avançado.
NEXT_STEPS["4"] = [
  ...NEXT_STEPS["3"],
  {
    steps: [
      { label: "Princípio Alfabético", text: "Relacionar cada sonzinho a uma letra. Ensinar que as letras fazem sons. Diga, por exemplo: “A letra F faz o som ‘fff’, como o de apagar o fogo.”" },
      { label: "Regras ortográficas", text: "Continue praticando as relações complexas entre letras e sons. Por exemplo, a letra C pode fazer o som “k-k-k” e “sss”. O ensino deve ser explícito e lúdico. Relembre 2 regras ortográficas por semana. Algumas estão listadas abaixo:", bullets: ORTHO_RULES },
      { label: "Leitura", text: "A criança deve alcançar a prosódia, a velocidade e a fluência na leitura. Para isso, continue praticando a leitura de palavras complexas. Pratique a leitura oral de textos todos os dias. A leitura repetida é uma aliada nesse momento, auxiliando a criança a tornar a leitura automática." },
      { label: "Escrita", text: "Continue praticando o traçado cursivo de cada letra, conforme o padrão. Trabalhe a escrita de pequenos textos, pelo menos 3× por semana, prezando pela ortografia e gramática." },
    ],
    promise: "Se você fizer 15 minutos todos os dias, seu filho poderá ser capaz de ler com fluência, velocidade e prosódia e de escrever pequenos textos em 3 meses.",
    cta: true,
  },
];

// Para cada idade, qual texto (índice em NEXT_STEPS[idade]) mostrar conforme o nível 0..4.
const NEXT_STEPS_INDEX: Record<string, number[]> = {
  "0-2": [0, 1, 1, 2, 3],
  "3":   [0, 1, 2, 3, 3],
  "4":   [1, 1, 2, 3, 4],
  "5-6": [0, 0, 1, 2, 3],
  "7+":  [0, 0, 1, 2, 3],
};

function nextStepFor(age: string, answers: Record<number, number>): NextStep | null {
  const list = NEXT_STEPS[age];
  const idxMap = NEXT_STEPS_INDEX[age];
  if (!list || !idxMap) return null;
  const tier = levelTier(metricTotal(answers));
  return list[idxMap[tier]] ?? null;
}


// Nível esperado por idade, por pergunta-métrica [Q1 Alfabeto, Q2 Sons, Q3 Sílabas, Q4 Palavras, Q5 Escrita].
// Derivado dos popups (ponto onde a frase vira "Isso é o esperado para a idade").
const EXPECTED_BY_AGE: Record<string, number[]> = {
  "0-2": [0, 0, 0, 0, 0],
  "3":   [1, 3, 1, 1, 1],
  "4":   [2, 3, 2, 2, 2],
  "5-6": [3, 3, 3, 3, 3],
  "7+":  [3, 3, 4, 4, 4],
};

// Score relativo à idade = soma de (nível atingido − nível esperado) nas 5 perguntas-métrica.
// Faixa: −18 (muito atrás) .. +18 (muito à frente); 0 = exatamente no esperado.
function relativeScore(answers: Record<number, number>, age: string): number {
  const expected = EXPECTED_BY_AGE[age];
  if (!expected) return 0;
  let s = 0;
  for (let q = 0; q < 5; q++) {
    if (answers[q] !== undefined) s += answers[q] - expected[q];
  }
  return s;
}

// Diagnóstico relativo: posição média (em "níveis") e a faixa de mensagem.
function relativeBand(score: number): { levels: number; tone: "ahead" | "on" | "behind" } {
  const levels = Math.round(score / 5);
  if (score >= 2) return { levels, tone: "ahead" };
  if (score >= -1) return { levels, tone: "on" };
  return { levels, tone: "behind" };
}

// Pontuação amigável (FLOOR..100, nunca chega a 0).
// Mistura dois sinais: o ABSOLUTO (quanto a criança sabe, 0..18) e o RELATIVO à idade (−18..+18).
// O componente absoluto faz cada idade aproveitar mais a barra (chegar perto de 100 e do piso);
// o relativo mantém a lógica de que, no mesmo nível, o mais novo pontua mais.
const SCORE_FLOOR = 10; // piso: ninguém pontua abaixo disso
const SCORE_CEIL = 90;  // teto: ninguém chega a 100
const ABS_WEIGHT = 0.4; // 0 = só relativo à idade · 1 = só absoluto
function relativePercent(answers: Record<number, number>, age: string): number {
  const absT = metricTotal(answers) / 18;            // 0..1  (desempenho absoluto)
  const relT = (relativeScore(answers, age) + 18) / 36; // 0..1  (posição para a idade)
  const t = ABS_WEIGHT * absT + (1 - ABS_WEIGHT) * relT;
  const pct = Math.round(SCORE_FLOOR + t * (SCORE_CEIL - SCORE_FLOOR));
  return Math.max(SCORE_FLOOR, Math.min(SCORE_CEIL, pct));
}

// Soma das 5 perguntas-métrica (0..18).
function metricTotal(answers: Record<number, number>): number {
  let s = 0;
  for (let q = 0; q < 5; q++) s += answers[q] ?? 0;
  return s;
}

// Converte a soma (0..18) num "nível" de 0 a 4, que decide qual texto de "Próximos passos" mostrar.
function levelTier(total: number): number {
  if (total <= 2) return 0;
  if (total <= 6) return 1;
  if (total <= 11) return 2;
  if (total <= 15) return 3;
  return 4;
}

// ===== Integração com o Google Form =====
// "[Gabriela] Quiz de Alfabetização" — envia as respostas direto para o formResponse.
const GFORM_ACTION =
  "https://docs.google.com/forms/d/e/1FAIpQLSdB1KDfdoBT0wlFM-DwgU0sXAOswgaVQfnPv1j2cgqRZCePGQ/formResponse";

const GFORM_NAME_ENTRY = "entry.436572937";
const GFORM_WHATSAPP_ENTRY = "entry.1994528083";
const GFORM_INSTAGRAM_ENTRY = "entry.417671479";
const GFORM_AGE_ENTRY = "entry.295870184";

const GFORM_AGE_LABELS: Record<string, string> = {
  "0-2": "0 a 2 anos",
  "3": "3 anos",
  "4": "4 anos",
  "5-6": "5 a 6 anos",
  "7+": "7 anos ou mais",
};

// entry ID de cada pergunta, na MESMA ordem do array QUESTIONS (Q1..Q11)
const GFORM_QUESTION_ENTRIES = [
  "entry.383983556",  // Q1
  "entry.1045847043", // Q2
  "entry.1796058230", // Q3
  "entry.481178193",  // Q4
  "entry.1251249363", // Q5
  "entry.121372732",  // Q6
  "entry.1319803792", // Q7
  "entry.1989111527", // Q8
  "entry.487380243",  // Q9
  "entry.1739913752", // Q10
  "entry.840126877",  // Q11
];

// Rótulos EXATOS das opções no Google Form, na mesma ordem das opções do quiz.
// (alguns diferem levemente dos textos exibidos no quiz; o Form exige correspondência exata)
const GFORM_OPTION_LABELS: string[][] = [
  ["Conhece todas", "Conhece a maioria", "Conhece algumas, mas confunde", "Não conhece letras"],
  ["Sabe todos", "Sabe a maioria", "Sabe alguns sons", "Não sabe nenhum som"],
  ["Sabe ler todas as sílabas, até as complexas", "Sabe ler todas as sílabas simples", "Sabe ler a maioria das sílabas", "Tenta ler, mas chuta algumas sílabas", "Não lê sílabas"],
  ["Consegue ler todas as palavras", "Consegue ler quase todas as palavras", "Tenta ler, mas ainda erra", "Tenta adivinhar", "Não lê palavras"],
  ["Escreve acertando praticamente tudo", "Escreve acertando a maioria", "Escreve com bastante erro", "Escreve sílabas ou palavras que já memorizou", "Não escreve"],
  ["Adora livros e pede para ler sempre", "Tem interesse mas desiste rápido quando trava", "Evita ler porque se frustra", "Ainda não demonstra interesse"],
  ["Sim e vejo progresso", "Sim, mas não sei se estou fazendo certo", "Tentei, mas desisti", "Ainda não tentei"],
  ["Sim, estudamos todo dia", "Às vezes, quando sobra tempo", "Tento mas não consigo manter", "Ainda não temos rotina"],
  ["Sim, já uso e quero me aprofundar", "Já ouvi falar mas nunca usei", "Já tentei mas tive dificuldades", "Nunca ouvi falar"],
  ["Está indo bem, acima da turma", "Está na média da turma", "Está abaixo da turma", "A escola ainda não identificou a dificuldade"],
  ["Persiste e tenta de novo", "Fica frustrado mas continua", "Chora ou demonstra tristeza", "Desiste e evita tentar"],
];

// Telas intermediárias "Continuar" do form (enviadas por garantia, caso obrigatórias)
const GFORM_INFO_ENTRIES = ["entry.1852189790", "entry.1457234374", "entry.982306383", "entry.157665875"];

// ===== Main =====
export default function QuizPage() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [age, setAge] = useState("");
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [popup, setPopup] = useState<string | null>(null);

  const screen = SCREENS[step];

  // Progress: counts question screens (1..12)
  const currentQuestionNumber =
    screen.type === "question" && typeof screen.qIndex === "number" ? screen.qIndex + 1 : 0;
  const progress = (currentQuestionNumber / TOTAL_QUESTIONS) * 100;
  const showProgress = screen.type === "question";

  const goNext = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, SCREENS.length - 1));
  };
  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  // Envia as respostas ao Google Form ao chegar na tela de resultado (uma única vez)
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    if (screen.type !== "result" || submitted) return;
    setSubmitted(true);
    try {
      const params = new URLSearchParams();
      if (name) params.append(GFORM_NAME_ENTRY, name);
      if (whatsapp) params.append(GFORM_WHATSAPP_ENTRY, whatsapp);
      if (instagram) params.append(GFORM_INSTAGRAM_ENTRY, instagram);
      if (GFORM_AGE_LABELS[age]) params.append(GFORM_AGE_ENTRY, GFORM_AGE_LABELS[age]);
      GFORM_QUESTION_ENTRIES.forEach((entryId, qi) => {
        const stored = answers[qi];
        if (stored === undefined) return;
        const q = QUESTIONS[qi];
        // perguntas neutras guardam o índice da opção; as métricas guardam o nível (= weight)
        const optIdx = q.neutral ? stored : q.options.findIndex((o) => o.weight === stored);
        const label = GFORM_OPTION_LABELS[qi]?.[optIdx];
        if (label) params.append(entryId, label);
      });
      GFORM_INFO_ENTRIES.forEach((e) => params.append(e, "Continuar"));
      // Necessário p/ o Google Forms não descartar a última resposta em página única
      params.append("fvv", "1");
      params.append("pageHistory", "0");
      fetch(GFORM_ACTION, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      }).catch(() => {});
    } catch {
      /* envio é silencioso; não bloqueia o quiz */
    }
  }, [screen.type, submitted, age, name, whatsapp, instagram, answers]);

  const canAdvance = useMemo(() => {
    switch (screen.type) {
      case "name": return name.trim().length >= 2;
      case "whatsapp": return whatsapp.replace(/\D/g, "").length >= 10;
      case "instagram": return instagram.trim().length >= 2;
      case "question": return answers[screen.qIndex!] !== undefined;
      default: return true;
    }
  }, [screen, name, whatsapp, instagram, answers]);

  const selectAge = (a: string) => {
    setAge(a);
    setTimeout(goNext, 250);
  };
  const selectAnswer = (qIdx: number, weight: number) => {
    setAnswers((prev) => ({ ...prev, [qIdx]: weight }));
    // Feedback instantâneo: se houver frase para (idade × pergunta × nível), mostra o popup
    // e só avança quando a pessoa tocar em "Continuar". Senão, avança como antes.
    const phrase = POPUP_TEXTS[age]?.[qIdx]?.[weight];
    if (phrase) {
      setPopup(phrase);
    } else {
      setTimeout(goNext, 350);
    }
  };
  const dismissPopup = () => {
    setPopup(null);
    goNext();
  };

  useEffect(() => {
    if (screen.type === "processing") {
      const t = setTimeout(goNext, 4200);
      return () => clearTimeout(t);
    }
  }, [screen.type]);


  // Total score: sum of all scoring answers (Q8 weights are 0 so safe to include)
  const totalScore = useMemo(
    () => Object.entries(answers).reduce((sum, [k, v]) => {
      const i = Number(k);
      if (QUESTIONS[i]?.neutral) return sum;
      return sum + v;
    }, 0),
    [answers]
  );
  const level = levelTier(totalScore);

  const showFooter = [
    "social", "benefit", "name", "whatsapp", "instagram",
    "interstitial", "interstitial2", "stat", "result",
  ].includes(screen.type);
  const showBack = step > 0 && screen.type !== "processing" && screen.type !== "sales";

  return (
    <div
      style={{ background: C.cream, color: C.warm }}
      className="fixed inset-0 overflow-hidden flex flex-col"
    >
      <div className="relative shrink-0" style={{ paddingTop: "env(safe-area-inset-top)" }}>
        <div className="h-14 flex items-center justify-between px-4">
          {showBack ? (
            <ActionIcon
              onClick={goBack}
              aria-label="Voltar"
              variant="subtle"
              radius="xl"
              size="lg"
              color="brand"
            >
              <IconChevronLeft size={24} stroke={2.5} />
            </ActionIcon>
          ) : <div className="w-10 h-10" />}
          <div className="text-xs font-semibold tracking-wider" style={{ color: C.green }}>
            ALFABETIZAR
          </div>
          {showProgress ? (
            <div className="text-xs font-bold tabular-nums" style={{ color: C.greenMid }}>
              {currentQuestionNumber}/{TOTAL_QUESTIONS}
            </div>
          ) : <div className="w-10 h-10" />}
        </div>
        <div className="mx-4">
          {showProgress && (
            <Progress value={progress} color="brand" size="sm" radius="xl" transitionDuration={500} />
          )}
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <div
          key={step}
          className="absolute inset-0 overflow-y-auto"
          style={{
            animation: `${direction === 1 ? "slideInRight" : "slideInLeft"} 0.42s cubic-bezier(0.22,1,0.36,1)`,
          }}
        >
          <ScreenContent
            screen={screen}
            age={age} onSelectAge={selectAge}
            name={name} setName={setName}
            whatsapp={whatsapp} setWhatsapp={setWhatsapp}
            instagram={instagram} setInstagram={setInstagram}
            answers={answers} onSelectAnswer={selectAnswer}
            totalScore={totalScore} level={level}
            qIndex={screen.qIndex}
            goNext={goNext}
          />
        </div>
      </div>

      {showFooter && screen.type !== "result" && (
        <div
          className="shrink-0 px-4 pt-3 pb-5"
          style={{
            paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)",
            background: `linear-gradient(to top, ${C.cream} 60%, transparent)`,
          }}
        >
          <Button
            onClick={goNext}
            disabled={!canAdvance}
            fullWidth
            size="lg"
            radius="xl"
            color="brand"
            rightSection={<IconArrowRight size={20} />}
          >
            {screen.type === "interstitial2" ? "Entendi" : "Continuar"}
          </Button>
        </div>
      )}

      {popup && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end"
          style={{ background: "rgba(26,92,53,0.4)", animation: "fadeIn 0.2s ease" }}
          onClick={dismissPopup}
        >
          <div
            className="rounded-t-3xl px-6 pt-6"
            style={{
              background: C.white,
              boxShadow: "0 -10px 40px -10px rgba(26,92,53,0.4)",
              paddingBottom: "calc(env(safe-area-inset-bottom) + 1.5rem)",
              animation: "sheetUp 0.35s cubic-bezier(0.22,1,0.36,1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 rounded-full mx-auto mb-5" style={{ background: C.greenSoft }} />
            <p className="text-xl font-bold text-center leading-snug" style={{ color: C.green }}>
              {popup}
            </p>
            <Button
              onClick={dismissPopup}
              fullWidth
              size="lg"
              radius="xl"
              color="brand"
              mt="lg"
              rightSection={<IconArrowRight size={20} />}
            >
              Continuar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== Router =====
function ScreenContent(props: any) {
  const { screen } = props;
  switch (screen.type) {
    case "age": return <AgeScreen onSelect={props.onSelectAge} selected={props.age} />;
    case "social": return <SocialScreen />;
    case "benefit": return <BenefitScreen />;
    case "name": return <NameScreen value={props.name} onChange={props.setName} />;
    case "whatsapp": return <WhatsappScreen value={props.whatsapp} onChange={props.setWhatsapp} />;
    case "instagram": return <InstagramScreen value={props.instagram} onChange={props.setInstagram} />;
    case "question": return (
      <QuestionScreen
        qIndex={props.qIndex}
        selected={props.answers[props.qIndex]}
        onSelect={(w: number) => props.onSelectAnswer(props.qIndex, w)}
      />
    );
    case "interstitial": return <InterstitialScreen />;
    case "interstitial2": return <Interstitial2Screen />;
    case "stat": return <StatScreen />;
    case "processing": return <ProcessingScreen name={props.name} />;
    case "result": return <ResultScreen name={props.name} level={props.level} answers={props.answers} age={props.age} />;
    case "sales": return <SalesRouter age={props.age} />;
    default: return null;
  }
}

// ===== Páginas de vendas em VSL (3 posições) =====
// Cada posição tem sua própria VSL (vídeo) + botão que aparece após X segundos.
// Quando a VSL de cada posição estiver pronta, preencha: playerHtml (div do player),
// scriptSrc (script do VTurb/Converteai), revealSeconds, ctaHref e ctaText.
type VslConfig = {
  headline: string;
  subhead?: string;
  revealSeconds: number;   // segundos até o botão de compra aparecer
  ctaText: string;
  ctaHref: string;
  playerHtml?: string;     // HTML do player (ex.: <div id="vid_xxx"></div>) — cole aqui
  scriptSrc?: string;      // src do script do player — cole aqui
};

const SALES_VSL: Record<"0-3" | "4+", VslConfig> = {
  // 0 a 3 anos: angulo de comecar cedo / dar vantagem (raramente esta "atrasado").
  "0-3": {
    headline: "Os primeiros anos são a base de toda a leitura do seu filho. Veja como começar do jeito certo, desde agora.",
    revealSeconds: 600,
    ctaText: "QUERO COMEÇAR CERTO",
    ctaHref: "#",
    // playerHtml: '<div id="vid_0_3"></div>',
    // scriptSrc: 'https://scripts.converteai.net/.../player.js',
  },
  // 4 anos ou mais: angulo de atraso / urgencia.
  "4+": {
    headline: "Existe um motivo científico para o seu filho ainda não ler como deveria, e a solução não está na escola. Está nas suas mãos.",
    revealSeconds: 600,
    ctaText: "QUERO COMEÇAR AGORA",
    ctaHref: "#",
    // playerHtml: '<div id="vid_4_mais"></div>',
    // scriptSrc: 'https://scripts.converteai.net/.../player.js',
  },
};

// Escolhe a VSL pela FAIXA DE IDADE: 0-2 e 3 anos -> "0-3"; 4, 5-6 e 7+ -> "4+".
function SalesRouter({ age }: { age: string }) {
  const group = age === "0-2" || age === "3" ? "0-3" : "4+";
  return <VslSalesScreen cfg={SALES_VSL[group]} />;
}

function VslSalesScreen({ cfg }: { cfg: VslConfig }) {
  const [showCta, setShowCta] = useState(false);

  // Botão de compra aparece após revealSeconds (contado a partir do carregamento da página).
  useEffect(() => {
    const t = setTimeout(() => setShowCta(true), cfg.revealSeconds * 1000);
    return () => clearTimeout(t);
  }, [cfg.revealSeconds]);

  // Injeta o script do player (VTurb/Converteai), se configurado.
  useEffect(() => {
    if (!cfg.scriptSrc) return;
    const s = document.createElement("script");
    s.src = cfg.scriptSrc;
    s.async = true;
    document.body.appendChild(s);
    return () => { document.body.removeChild(s); };
  }, [cfg.scriptSrc]);

  return (
    <div className="min-h-full px-5 pt-6 pb-10">
      <div className="max-w-2xl mx-auto space-y-6 text-center">
        <H1>{cfg.headline}</H1>
        {cfg.subhead && <p className="text-base" style={{ color: C.warm }}>{cfg.subhead}</p>}

        {/* Área do vídeo (VSL) */}
        <div className="rounded-2xl overflow-hidden" style={{ border: `2px solid ${C.mint}`, boxShadow: `0 20px 40px -24px rgba(26,92,53,0.25)` }}>
          {cfg.playerHtml ? (
            <div dangerouslySetInnerHTML={{ __html: cfg.playerHtml }} />
          ) : (
            <div className="aspect-video flex items-center justify-center text-sm" style={{ background: C.mintLight, color: C.warm }}>
              [ VSL aqui — cole o embed do player ]
            </div>
          )}
        </div>

        {/* Botão de compra (aparece após revealSeconds) */}
        {showCta ? (
          <a
            href={cfg.ctaHref}
            className="block w-full rounded-2xl py-4 text-lg font-bold transition active:scale-[0.98]"
            style={{ background: C.green, color: C.white }}
          >
            {cfg.ctaText}
          </a>
        ) : (
          <p className="text-sm" style={{ color: C.warm }}>Assista ao vídeo até o final para liberar o seu acesso.</p>
        )}
      </div>
    </div>
  );
}

function H1({ children, style }: any) {
  return <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight" style={{ color: C.green, ...style }}>{children}</h1>;
}

// ===== Screens =====
function AgeScreen({ onSelect, selected }: { onSelect: (s: string) => void; selected: string }) {
  const cards = [
    { id: "0-2", label: "0 a 2 anos", img: age34 },
    { id: "3", label: "3 anos", img: age3 },
    { id: "4", label: "4 anos", img: age56 },
    { id: "5-6", label: "5 a 6 anos", img: age78 },
    { id: "7+", label: "7 anos ou mais", img: age9 },
  ];
  return (
    <div className="min-h-full px-5 pt-2 pb-8 flex flex-col">
      <div className="text-center mb-2">
        <H1>DIAGNÓSTICO DE ALFABETIZAÇÃO</H1>
        <p className="mt-2 text-sm uppercase tracking-widest" style={{ color: C.warm }}>para o seu filho</p>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-6 max-w-md mx-auto w-full">
        {cards.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className="relative aspect-[3/4] rounded-3xl overflow-hidden transition active:scale-[0.97]"
            style={{
              boxShadow: selected === c.id ? `0 0 0 3px ${C.green}` : `0 8px 24px -12px rgba(26,92,53,0.25)`,
            }}
          >
            <img src={c.img.src} alt={c.label} className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute bottom-2 left-2 right-2 rounded-2xl px-3 py-2.5 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(6px)" }}>
              <span className="font-bold text-sm" style={{ color: C.green }}>{c.label}</span>
              <span style={{ color: C.greenMid }}>›</span>
            </div>
          </button>
        ))}
      </div>
      <p className="text-xs text-center mt-6" style={{ color: C.warm }}>
        Ao continuar, você aceita nossos <u>Termos de uso</u> e <u>Política de privacidade</u>.
      </p>
    </div>
  );
}

function SocialScreen() {
  return (
    <div className="min-h-full px-5 py-6 flex flex-col" style={{ background: C.mint }}>
      <div className="flex-1 flex flex-col justify-center gap-6 max-w-xl mx-auto w-full">
        <div>
          <div className="text-6xl md:text-7xl font-bold leading-none" style={{ color: C.green }}>200.000+</div>
          <div className="mt-3 text-xl font-bold" style={{ color: C.green }}>mães brasileiras</div>
          <p className="mt-2 text-base" style={{ color: C.warm }}>
            já aplicaram o método fônico em casa e viram resultados na primeira semana.
          </p>
        </div>
        <div className="rounded-3xl overflow-hidden bg-white shadow-lg">
          <img src={motherChild.src} alt="Mãe e filho lendo juntos" className="w-full h-56 object-cover" loading="lazy" />
        </div>
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: C.warm }}>Como aparece em</p>
          <div className="flex justify-center gap-4 text-sm font-bold" style={{ color: C.green }}>
            <span>G1</span><span>·</span><span>UOL Educação</span><span>·</span><span>Nova Escola</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function BenefitScreen() {
  return (
    <div className="min-h-full px-5 py-6 flex flex-col">
      <div className="flex-1 flex flex-col justify-center gap-8 max-w-xl mx-auto w-full">
        <div>
          <H1>Seu filho vai aprender a ler do jeito certo!</H1>
          <p className="mt-4 text-base" style={{ color: C.warm }}>
            A instrução fônica vai desenvolver a leitura do seu filho de forma sistemática e progressiva.
          </p>
          <p className="mt-3 text-base font-bold" style={{ color: C.green }}>
            Vamos montar um diagnóstico personalizado para o seu filho.
          </p>
        </div>
        <div className="mx-auto w-full max-w-xs">
          <div className="rounded-[2.5rem] p-2 shadow-2xl" style={{ background: C.green }}>
            <div className="rounded-[2rem] p-5" style={{ background: C.cream }}>
              <div className="text-xs font-bold mb-2" style={{ color: C.greenMid }}>SEU DIAGNÓSTICO</div>
              <div className="text-2xl font-bold" style={{ color: C.green }}>Nível 3</div>
              <div className="text-xs mb-3" style={{ color: C.warm }}>Em desenvolvimento</div>
              <div className="space-y-2">
                {[78, 64, 52, 70].map((v, i) => (
                  <div key={i}>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: C.mintLight }}>
                      <div className="h-full rounded-full" style={{ width: `${v}%`, background: C.greenMid }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 h-20 rounded-xl flex items-end gap-1 p-2" style={{ background: C.mintLight }}>
                {[40, 60, 30, 75, 55, 80, 65].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: C.green }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NameScreen({ value, onChange }: any) {
  return (
    <div className="min-h-full px-5 py-10 flex flex-col">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <H1 style={{ textAlign: "center" }}>Como posso te chamar?</H1>
        <TextInput
          autoFocus
          value={value}
          onChange={(e) => onChange(e.currentTarget.value)}
          placeholder="Seu nome"
          size="lg"
          radius="md"
          mt="xl"
        />
      </div>
    </div>
  );
}

function maskPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 7) return `(${d.slice(0,2)}) ${d.slice(2)}`;
  return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
}

function WhatsappScreen({ value, onChange }: any) {
  return (
    <div className="min-h-full px-5 py-10 flex flex-col">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <H1 style={{ textAlign: "center" }}>Qual é o seu WhatsApp?</H1>
        <p className="text-sm text-center mt-2" style={{ color: C.warm }}>Vou enviar o diagnóstico completo por aqui.</p>
        <TextInput
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(maskPhone(e.currentTarget.value))}
          placeholder="(XX) XXXXX-XXXX"
          size="lg"
          radius="md"
          mt="xl"
        />
      </div>
    </div>
  );
}

function InstagramScreen({ value, onChange }: any) {
  return (
    <div className="min-h-full px-5 py-10 flex flex-col">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <H1 style={{ textAlign: "center" }}>Qual é o seu Instagram?</H1>
        <TextInput
          value={value}
          onChange={(e) => onChange(e.currentTarget.value)}
          placeholder="@seuinstagram"
          size="lg"
          radius="md"
          mt="xl"
        />
      </div>
    </div>
  );
}

function QuestionScreen({ qIndex, selected, onSelect }: { qIndex: number; selected?: number; onSelect: (w: number) => void }) {
  const q = QUESTIONS[qIndex];
  return (
    <div className="min-h-full px-5 pt-4 pb-24 flex flex-col">
      <div className="max-w-xl mx-auto w-full">
        <div className="text-xs font-bold tracking-wider mb-3" style={{ color: C.greenMid }}>
          PERGUNTA {qIndex + 1} DE {TOTAL_QUESTIONS}
        </div>
        <H1>{q.title}</H1>
        {q.subtitle && <p className="mt-2 text-base" style={{ color: C.warm }}>{q.subtitle}</p>}
        <div className="mt-6 space-y-3">
          {q.options.map((opt, i) => {
            // Neutral question stores option index (since all weights are 0)
            const sel = q.neutral ? (selected === i) : (selected === opt.weight);
            return (
              <button
                key={i}
                onClick={() => onSelect(q.neutral ? i : opt.weight)}
                className="w-full text-left rounded-2xl p-4 flex items-center gap-4 transition active:scale-[0.985]"
                style={{
                  background: sel ? C.mint : C.white,
                  border: `2px solid ${sel ? C.green : C.greenSoft}`,
                  boxShadow: sel ? `0 8px 20px -10px ${C.green}` : `0 4px 14px -10px rgba(26,92,53,0.2)`,
                }}
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-lg shrink-0"
                  style={{ background: sel ? C.white : C.mintLight, color: C.green }}
                >
                  {opt.icon}
                </div>
                <div className="flex-1 font-semibold text-[15px] leading-snug" style={{ color: C.green }}>
                  {opt.label}
                </div>
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition"
                  style={{
                    background: sel ? C.green : "transparent",
                    border: `2px solid ${sel ? C.green : C.greenSoft}`,
                  }}
                >
                  {sel && <IconCheck size={14} color="white" stroke={3} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function InterstitialScreen() {
  return (
    <div className="min-h-full px-5 py-10 flex items-center justify-center" style={{ background: C.mint }}>
      <div className="rounded-3xl bg-white p-6 max-w-md w-full" style={{ boxShadow: `0 20px 50px -20px rgba(26,92,53,0.3)` }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: C.mint }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21h6M12 3a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2v.3h6v-.3c0-.8.4-1.5 1-2A7 7 0 0 0 12 3z"/></svg>
        </div>
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider" style={{ background: C.green, color: C.white }}>VOCÊ SABIA?</span>
        <h2 className="text-2xl font-bold mt-3" style={{ color: C.green }}>
          Saber o nome da letra é diferente de saber o som.
        </h2>
        <p className="mt-3 text-base" style={{ color: C.warm }}>
          O "M" não se chama "éme". Ele faz o som "mmm". Essa confusão é a principal causa de dificuldade na leitura.
        </p>
      </div>
    </div>
  );
}

function Interstitial2Screen() {
  return (
    <div className="min-h-full px-5 py-10 flex items-center justify-center" style={{ background: C.mint }}>
      <div className="rounded-3xl bg-white p-6 max-w-md w-full" style={{ boxShadow: `0 20px 50px -20px rgba(26,92,53,0.3)` }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: C.mint }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 10l9-7 9 7v10a2 2 0 0 1-2 2h-4v-7H10v7H5a2 2 0 0 1-2-2V10z"/>
          </svg>
        </div>
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider" style={{ background: C.green, color: C.white }}>VOCÊ SABIA?</span>
        <h2 className="text-2xl font-bold mt-3" style={{ color: C.green }}>
          A escola sozinha pode não ser suficiente.
        </h2>
        <p className="mt-3 text-base" style={{ color: C.warm }}>
          Pesquisas mostram que crianças cujos pais se envolvem ativamente na alfabetização aprendem a ler muito mais rápido. 15 minutos por dia em casa fazem toda a diferença.
        </p>
      </div>
    </div>
  );
}

function StatScreen() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - start) / 1500, 1);
      setPct(Math.round(p * 56));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const angle = (pct / 100) * 360;
  return (
    <div className="min-h-full px-5 py-8 flex flex-col" style={{ background: C.mint }}>
      <div className="flex-1 flex flex-col justify-center gap-6 max-w-xl mx-auto w-full">
        <div>
          <div className="text-7xl md:text-8xl font-bold leading-none" style={{ color: C.green }}>{pct}%</div>
          <div className="mt-3 text-xl font-bold" style={{ color: C.green }}>das crianças do 2º ano</div>
          <p className="mt-2 text-base" style={{ color: C.warm }}>não foram alfabetizadas na faixa etária esperada no Brasil.</p>
          <p className="mt-1 text-xs" style={{ color: C.warm }}>Fonte: Agência Brasil, 2024</p>
        </div>
        <div className="flex items-center justify-center gap-6">
          <div
            className="w-40 h-40 rounded-full"
            style={{
              background: `conic-gradient(#d97766 ${angle}deg, ${C.greenMid} ${angle}deg)`,
              transition: "background 0.1s linear",
            }}
          >
            <div className="w-full h-full rounded-full flex items-center justify-center">
              <div className="w-20 h-20 rounded-full" style={{ background: C.mint }} />
            </div>
          </div>
          <div className="text-sm space-y-2" style={{ color: C.green }}>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded" style={{ background: "#d97766" }}/>Não alfabetizadas</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded" style={{ background: C.greenMid }}/>Alfabetizadas</div>
          </div>
        </div>
        <p className="text-center text-base font-semibold" style={{ color: C.green }}>
          Seu diagnóstico vai ajudar a garantir que seu filho não faça parte dessa estatística.
        </p>
      </div>
    </div>
  );
}

function ProcessingScreen({ name }: { name: string }) {
  const messages = [
    "Analisando as respostas...",
    `Calculando o nível de ${name || "seu filho"}...`,
    "Construindo o diagnóstico...",
    "Quase pronto...",
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => Math.min(i + 1, messages.length - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="min-h-full flex flex-col items-center justify-center px-5" style={{ background: C.mint }}>
      <div className="relative w-40 h-40 flex items-center justify-center">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-full border-2"
            style={{
              borderColor: C.green,
              animation: `pulseRing 2s ease-out ${i * 0.6}s infinite`,
              opacity: 0,
            }}
          />
        ))}
        <div className="w-16 h-16 rounded-full" style={{ background: C.green }} />
      </div>
      <div key={idx} className="mt-10 text-lg font-semibold text-center" style={{ color: C.green, animation: "fadeInUp 0.5s ease" }}>
        {messages[idx]}
      </div>
    </div>
  );
}

// ===== Resultado personalizado =====
function ResultScreen({ name, level, answers, age }: { name: string; level: number; answers: Record<number, number>; age: string }) {
  const info = LEVEL_TEXTS[level];
  const firstName = (name || "Olá").split(" ")[0];
  // Diagnóstico relativo à idade (independente do estágio que escolhe a página de vendas)
  const rawRel = relativeScore(answers, age);
  const rel = relativeBand(rawRel);
  const pct = relativePercent(answers, age);
  const nextStep = nextStepFor(age, answers);
  const relN = Math.abs(rel.levels);
  const relNoun = relN === 1 ? "nível" : "níveis";
  const relHeadline =
    rel.tone === "ahead"
      ? relN > 0 ? `Seu filho está ${relN} ${relNoun} à frente para a idade` : "Seu filho está à frente do esperado para a idade"
      : rel.tone === "behind"
      ? relN > 0 ? `Seu filho está ${relN} ${relNoun} atrás para a idade` : "Seu filho está atrás do esperado para a idade"
      : "Seu filho está no ritmo esperado para a idade";
  const relSub =
    rel.tone === "ahead"
      ? "Ele está se desenvolvendo acima do esperado para a faixa etária. O método fônico vai manter esse ritmo e aprofundar a base."
      : rel.tone === "behind"
      ? "Há uma lacuna em relação ao esperado para a idade, e ela tem solução. O método fônico age exatamente nesse ponto."
      : "Ele está acompanhando o esperado para a faixa etária. O método fônico vai consolidar e avançar com segurança.";
  // Radar 4 axes — normaliza cada eixo pelo seu teto (Alfabeto/Sons até 3; Leitura/Escrita até 4)
  const skills = [
    { label: "Alfabeto", value: ((answers[0] ?? 0) / 3) * 0.9 },
    { label: "Sons", value: ((answers[1] ?? 0) / 3) * 0.9 },
    { label: "Leitura", value: ((answers[3] ?? 0) / 4) * 0.9 },
    { label: "Escrita", value: ((answers[4] ?? 0) / 4) * 0.9 },
  ];

  return (
    <div className="min-h-full px-5 pt-4 pb-8">
      <div className="max-w-xl mx-auto space-y-5">
        <div className="text-2xl md:text-3xl font-bold" style={{ color: C.greenMid }}>{firstName},</div>
        <H1>seu diagnóstico de alfabetização está pronto!</H1>

        <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wider" style={{ background: info.tagColor, color: level >= 4 ? C.white : C.green }}>
          {info.name.toUpperCase()}
        </div>

        <div className="rounded-3xl p-5" style={{ background: rel.tone === "behind" ? C.redSoft : C.mintLight, border: `2px solid ${rel.tone === "behind" ? C.red : C.mint}` }}>
          <div className="text-xs font-bold tracking-wider mb-2" style={{ color: rel.tone === "behind" ? C.red : C.green }}>POSIÇÃO PARA A IDADE</div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-5xl font-extrabold leading-none" style={{ color: rel.tone === "behind" ? C.red : C.green }}>{pct}</span>
            <span className="text-sm font-semibold" style={{ color: C.warm }}>/ 100 pontos para a idade</span>
          </div>
          <p className="text-lg font-bold leading-snug" style={{ color: rel.tone === "behind" ? C.red : C.green }}>{relHeadline}</p>
          <p className="text-sm mt-2 leading-relaxed" style={{ color: C.warm }}>{relSub}</p>
        </div>

        <div className="rounded-3xl bg-white p-5" style={{ border: `2px solid ${C.mint}` }}>
          <h3 className="font-bold mb-3" style={{ color: C.green }}>Habilidades do seu filho</h3>
          <Radar data={skills} />
        </div>

        {nextStep && <NextStepsCard step={nextStep} />}
      </div>
    </div>
  );
}

function NextStepsCard({ step }: { step: NextStep }) {
  return (
    <div className="rounded-3xl bg-white p-5" style={{ border: `2px solid ${C.mint}`, boxShadow: `0 12px 30px -20px rgba(26,92,53,0.25)` }}>
      <div className="text-xs font-bold tracking-wider mb-4" style={{ color: C.green }}>PRÓXIMOS PASSOS</div>
      <div className="space-y-4">
        {step.steps.map((s, i) => (
          <div key={i}>
            <h4 className="font-bold mb-1" style={{ color: C.green }}>{s.label}</h4>
            <p className="text-sm leading-relaxed" style={{ color: C.warm }}>{s.text}</p>
            {s.bullets && (
              <ul className="mt-2 ml-5 list-disc text-sm space-y-1" style={{ color: C.warm }}>
                {s.bullets.map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      {step.promise && (
        <div className="mt-5 rounded-2xl p-4 text-sm font-semibold leading-relaxed" style={{ background: C.mintLight, color: C.green }}>
          {step.promise}
        </div>
      )}
    </div>
  );
}

function Radar({ data }: { data: { label: string; value: number }[] }) {
  const cx = 130, cy = 130, R = 90;
  const n = data.length;
  const pt = (i: number, v: number) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return [cx + Math.cos(a) * R * v, cy + Math.sin(a) * R * v];
  };
  const poly = data.map((d, i) => pt(i, d.value).join(",")).join(" ");
  return (
    <svg viewBox="0 0 260 260" className="w-full max-w-xs mx-auto">
      {[0.25, 0.5, 0.75, 1].map((s) => (
        <polygon
          key={s}
          points={data.map((_, i) => pt(i, s).join(",")).join(" ")}
          fill="none" stroke={C.mint} strokeWidth="1"
        />
      ))}
      {data.map((_, i) => {
        const [x, y] = pt(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={C.mint} strokeWidth="1" />;
      })}
      <polygon points={poly} fill={C.greenMid} fillOpacity="0.35" stroke={C.greenMid} strokeWidth="2" />
      {data.map((d, i) => {
        const [x, y] = pt(i, 1.22);
        return <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight="700" fill={C.green}>{d.label}</text>;
      })}
    </svg>
  );
}

// ===== Sales — Nível 1 (Pré-leitor) — Curso Primeiros Passos =====
function SalesScreenL1({ name }: { name: string }) {
  const [checked, setChecked] = useState<boolean[]>([false, false, false, false, false]);
  const items = [
    "Meu filho ainda não reconhece as letras e não sei por onde começar.",
    "Quero garantir que ele aprenda do jeito certo antes de entrar na escola.",
    "Já tentei ensinar em casa mas não sabia qual sequência seguir.",
    "Ouço falar em instrução fônica mas nunca entendi como aplicar na prática.",
    "Tenho medo de ensinar errado e criar uma base ruim para o meu filho.",
  ];
  
  const firstName = (name || "").split(" ")[0] || "você";

  const Cta = ({ children }: { children: React.ReactNode }) => (
    <Button fullWidth size="lg" radius="xl" color="brand" mt="md">
      {children}
    </Button>
  );

  return (
    <div className="min-h-full" style={{ background: C.cream }}>
      {/* HERO */}
      <section className="px-5 pt-12 pb-10" style={{ background: C.mint }}>
        <div className="max-w-xl mx-auto text-center">
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold mb-4" style={{ background: C.white, color: C.green }}>
            Curso · Acesso vitalício
          </span>
          <H1>{firstName}, seu filho ainda não começou. E isso é uma vantagem enorme.</H1>
          <p className="mt-4 text-base" style={{ color: C.warm }}>
            Crianças que aprendem pelo método fônico desde o início chegam à leitura fluente muito mais rápido do que as que tentam outros caminhos. Você está no momento certo para construir essa base do zero, do jeito certo.
          </p>
          <Cta>Quero começar do jeito certo →</Cta>
          <p className="text-xs mt-3" style={{ color: C.green }}>Acesso imediato. Assista quando e onde quiser.</p>
        </div>
      </section>

      {/* AUTOIDENTIFICAÇÃO */}
      <section className="px-5 py-10">
        <div className="max-w-xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold mb-3" style={{ background: C.mint, color: C.green }}>
            isso é para você se...
          </span>
          <H1>Se você se identifica com ao menos 2 desses itens, esse curso foi feito para você.</H1>
          <p className="mt-3 text-sm" style={{ color: C.warm }}>Marque as opções abaixo 👇</p>
          <div className="mt-5 space-y-3">
            {items.map((t, i) => (
              <Checkbox
                key={i}
                checked={checked[i]}
                onChange={() => setChecked((c) => c.map((v, j) => (j === i ? !v : v)))}
                label={t}
                color="brand"
                size="md"
                className="p-4 rounded-2xl bg-white"
                styles={{
                  root: { border: `2px solid ${checked[i] ? C.green : C.mint}` },
                  body: { alignItems: "center" },
                  label: { color: C.green, fontSize: 14 },
                }}
              />
            ))}
          </div>
          <Cta>Quero começar do jeito certo →</Cta>
        </div>
      </section>

      {/* DADOS */}
      <section className="px-5 py-10" style={{ background: C.mintLight }}>
        <div className="max-w-xl mx-auto">
          <H1>O Brasil tem um problema sério com a alfabetização das crianças. E a solução já existe.</H1>
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="rounded-3xl bg-white p-5" style={{ border: `2px solid ${C.redSoft}` }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ background: C.redSoft, color: C.red }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 9v4M12 17h.01"/><path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
              </div>
              <h3 className="font-bold text-lg mb-3" style={{ color: C.red }}>O problema</h3>
              <ul className="space-y-2 text-sm" style={{ color: C.warm }}>
                {[
                  "56% das crianças do 2º ano não foram alfabetizadas na faixa etária esperada",
                  "Quase 40% já tinham dificuldade antes da pandemia",
                  "Crianças na escola mas sem aprender a ler",
                ].map((t, i) => (
                  <li key={i} className="flex gap-2"><span style={{ color: C.red }}>✗</span>{t}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-white p-5" style={{ border: `2px solid ${C.greenSoft}` }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ background: C.mint, color: C.green }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h3 className="font-bold text-lg mb-3" style={{ color: C.green }}>A solução</h3>
              <ul className="space-y-2 text-sm" style={{ color: C.warm }}>
                {[
                  "97,1% das crianças do Ceará foram alfabetizadas em 2023 com método fônico",
                  "Salto de 12,5 pontos percentuais em um ano",
                  "Método comprovado pela ciência e pelos resultados",
                ].map((t, i) => (
                  <li key={i} className="flex gap-2"><span style={{ color: C.green }}>✓</span>{t}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-xs mt-4" style={{ color: C.warm }}>Fonte: Agência Brasil, 2024 · Governo do Ceará, 2024</p>
          <p className="mt-5 text-base" style={{ color: C.green }}>
            Você está no momento certo para garantir que seu filho não faça parte dessa estatística. A base que você vai construir agora vai acompanhar ele para sempre.
          </p>
          <Cta>Quero começar do jeito certo →</Cta>
        </div>
      </section>

      {/* 3 PASSOS */}
      <section className="px-5 py-10">
        <div className="max-w-xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold mb-3" style={{ background: C.mint, color: C.green }}>
            a solução
          </span>
          <H1>É por isso que você vai precisar dos Primeiros Passos na Instrução Fônica.</H1>
          <p className="mt-3 text-sm" style={{ color: C.warm }}>
            E é assim que, finalmente, você vai saber exatamente como construir a base de leitura do seu filho:
          </p>
          <div className="mt-6 space-y-4">
            {[
              ["01", "Entender como seu filho aprende", "Você vai descobrir como o cérebro da criança processa a leitura e por que começar pelos sons, não pelas letras, muda tudo."],
              ["02", "Dominar a sequência certa de ensino", "Você vai aprender quais sons ensinar primeiro, em qual ordem e como avançar sem confundir a criança que ainda está no início."],
              ["03", "Criar uma rotina de 15 minutos que funciona", "Você vai montar uma rotina simples e consistente que qualquer mãe consegue aplicar, mesmo sem experiência."],
            ].map(([n, t, d], i) => (
              <div key={i} className="flex gap-4 p-5 rounded-3xl bg-white" style={{ border: `2px solid ${C.mint}` }}>
                <div className="text-3xl font-bold shrink-0" style={{ color: C.greenSoft }}>{n}</div>
                <div>
                  <div className="font-bold mb-1" style={{ color: C.green }}>{t}</div>
                  <div className="text-sm" style={{ color: C.warm }}>{d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* O QUE VOCÊ VAI APRENDER */}
      <section className="px-5 py-10" style={{ background: C.mintLight }}>
        <div className="max-w-xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold mb-3" style={{ background: C.mint, color: C.green }}>
            o que vem dentro
          </span>
          <H1>O que você vai encontrar dentro do curso:</H1>
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            {[
              ["✨", "Você vai descobrir que consegue ensinar", "Antes de qualquer método, você vai entender como o aprendizado funciona. Vamos falar sobre como as pessoas aprendem, como você vai poder ensinar com confiança e o que vai fazer você ser fascinante para o seu filho na hora de ensinar."],
              ["📚", "O método das 3 lições", "Você vai aprender o melhor método para ensinar qualquer conteúdo, cativando a atenção do seu filho com apenas 3 passos. Você aprenderá com exemplos práticos."],
              ["📖", "Você vai aprender instrução fônica na prática", "A teoria só até onde você vai precisar. O foco vai ser prático."],
              ["👂", "Você vai despertar a audição do seu filho", "Você vai realizar 4 atividades ao vivo para desenvolver a percepção auditiva da criança. E ainda receberá um caderno de atividades completo em PDF para você usar em casa."],
              ["🎙️", "Você vai entender os sonzinhos da fala", "Cada sonzinho pode ser ensinado de uma forma lúdica, com um material exclusivo e original: as fichas dos sons. Esse material fará parte do seu dia a dia."],
              ["🔑", "Você vai compreender o princípio alfabético", "Você vai entender como chegar ao momento em que a criança percebe que as letras fazem sons, com segurança e sem pressa."],
            ].map(([icon, title, text], i) => (
              <div key={i} className="rounded-3xl bg-white p-5" style={{ border: `2px solid ${C.mint}` }}>
                <div className="text-3xl mb-2">{icon}</div>
                <div className="font-bold mb-2" style={{ color: C.green }}>{title}</div>
                <div className="text-sm" style={{ color: C.warm }}>{text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS EMOCIONAIS */}
      <section className="px-5 py-10">
        <div className="max-w-xl mx-auto">
          <H1>Depois do curso você vai...</H1>
          <ul className="mt-6 space-y-3">
            {[
              "Saber exatamente por onde começar, sem achismo e sem tentativa e erro",
              "Ter confiança para criar uma rotina em casa que realmente funciona",
              "Ver seu filho dar os primeiros passos na leitura com você do lado",
              "Garantir que ele chegue à escola com uma base que a maioria não tem",
              "Parar de depender só da escola para garantir a alfabetização do seu filho",
            ].map((t, i) => (
              <li key={i} className="flex gap-3 p-4 rounded-2xl bg-white" style={{ border: `2px solid ${C.mint}` }}>
                <span className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs font-bold" style={{ background: C.green, color: C.white }}>✓</span>
                <span className="text-sm" style={{ color: C.green }}>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* STACK DE VALOR */}
      <section className="px-5 py-10" style={{ background: C.mintLight }}>
        <div className="max-w-xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold mb-3" style={{ background: C.mint, color: C.green }}>
            recapitulando
          </span>
          <H1>Tudo que você vai receber no curso Primeiros Passos na Instrução Fônica</H1>
          <div className="grid md:grid-cols-2 gap-5 mt-6">
            <div className="space-y-2 text-sm">
              {[
                ["Aula completa com a Gabriela Engler", "R$297"],
                ["O método das 3 lições na prática", "R$97"],
                ["Instrução fônica na prática", "R$97"],
                ["Caderno de atividades de percepção auditiva em PDF", "R$47"],
                ["Fichas dos sons", "R$47"],
                ["Acesso vitalício", "incalculável"],
              ].map(([t, v], i) => (
                <div key={i} className="flex justify-between gap-3 p-3 rounded-xl bg-white">
                  <span style={{ color: C.green }}>{t}</span>
                  <span className="line-through shrink-0" style={{ color: C.red }}>{v}</span>
                </div>
              ))}
              <p className="mt-3 text-sm" style={{ color: C.warm }}>
                No total isso tudo deveria custar <span className="line-through">R$488</span>. Mas hoje você vai ter acesso completo ao curso por apenas:
              </p>
            </div>
            <div className="rounded-3xl p-6 shadow-2xl" style={{ background: C.green, color: C.white }}>
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold" style={{ background: C.greenSoft, color: C.green }}>
                acesso completo por apenas
              </span>
              <div className="text-5xl font-bold mt-3">R$97</div>
              <p className="text-sm" style={{ color: C.greenSoft }}>pagamento único · acesso vitalício</p>
              <button className="mt-5 w-full h-14 rounded-full font-bold text-base transition active:scale-[0.98]" style={{ background: C.white, color: C.green }}>
                Quero começar do jeito certo →
              </button>
              <p className="text-xs text-center mt-3" style={{ color: C.greenSoft }}>PIX · Cartão · Compra segura</p>
            </div>
          </div>
        </div>
      </section>

      {/* FLUXO PÓS-COMPRA */}
      <section className="px-5 py-10">
        <div className="max-w-xl mx-auto">
          <H1>Veja o que vai acontecer depois que você garantir o acesso:</H1>
          <div className="mt-6 space-y-4">
            {[
              ["Passo 1", "Confirmação por e-mail", "Você vai receber um e-mail com a confirmação da compra e o link de acesso ao curso."],
              ["Passo 2", "Acesso imediato", "Em poucos minutos você já vai poder assistir a primeira aula e começar a planejar a rotina em casa."],
              ["Passo 3", "Aplicação com seu filho", "Com o conteúdo em mãos, você vai criar uma rotina de 15 minutos e começar a construir a base de leitura do seu filho ainda hoje."],
            ].map(([tag, t, d], i) => (
              <div key={i} className="p-5 rounded-3xl bg-white" style={{ border: `2px solid ${C.mint}` }}>
                <div className="text-xs font-bold mb-1" style={{ color: C.greenMid }}>{tag}</div>
                <div className="font-bold mb-1" style={{ color: C.green }}>{t}</div>
                <div className="text-sm" style={{ color: C.warm }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOBRE A GABRIELA */}
      <section className="px-5 py-10" style={{ background: C.mintLight }}>
        <div className="max-w-xl mx-auto">
          <div className="rounded-3xl bg-white p-6" style={{ border: `2px solid ${C.mint}` }}>
            <img src={motherChild.src} alt="Gabriela Engler" className="w-28 h-28 rounded-full object-cover mx-auto mb-4" />
            <p className="text-center text-xs font-bold uppercase tracking-wider" style={{ color: C.greenMid }}>Quem vai te ensinar</p>
            <p className="mt-3 text-sm text-center" style={{ color: C.warm }}>
              Sou a <strong style={{ color: C.green }}>Gabriela Engler</strong>, especialista em instrução fônica com mais de 8 anos alfabetizando crianças. Já vi de perto o que funciona e o que não funciona. Nesse curso você vai aprender na prática o que eu aplico com cada criança que atendo, em uma linguagem simples e direta para qualquer mãe conseguir replicar em casa, mesmo que seu filho ainda esteja no início.
            </p>
            <p className="text-center text-sm font-semibold mt-3" style={{ color: C.greenMid }}>@elagabriela.abc</p>
          </div>
        </div>
      </section>

      {/* TURMA INAUGURAL */}
      <section className="px-5 py-6">
        <div className="max-w-xl mx-auto">
          <div className="rounded-3xl p-6 text-center" style={{ background: C.mint }}>
            <div className="text-yellow-500 text-xl">★★★★★</div>
            <h3 className="text-2xl font-bold mt-2" style={{ color: C.green }}>Seja uma das primeiras.</h3>
            <p className="mt-2 text-sm" style={{ color: C.warm }}>
              Esse é o primeiro curso da Gabriela Engler. Garante o seu acesso agora e faz parte da história.
            </p>
            <span className="inline-block mt-3 px-3 py-1 rounded-full text-xs font-bold" style={{ background: C.green, color: C.white }}>
              Lançamento com condição especial
            </span>
          </div>
        </div>
      </section>

      {/* GARANTIA */}
      <section className="px-5 py-6">
        <div className="max-w-md mx-auto">
          <div className="rounded-3xl bg-white p-6 text-center" style={{ border: `2px solid ${C.mint}` }}>
            <div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-3" style={{ background: C.mint }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3 className="font-bold text-lg" style={{ color: C.green }}>Garantia total</h3>
            <p className="text-sm mt-2" style={{ color: C.warm }}>
              Assista ao curso completo e, se sentir que não aprendeu nada que consegue aplicar em casa, devolvo o seu dinheiro. Sem burocracia. Você vai comprar com total segurança.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 py-10">
        <div className="max-w-xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold mb-3" style={{ background: C.mint, color: C.green }}>
            dúvidas frequentes
          </span>
          <H1>Confira se a sua dúvida não está respondida abaixo</H1>
          <div className="mt-6 space-y-3">
            {[
              ["Vou precisar ter formação em pedagogia?", "Não. O curso foi feito para mães sem formação na área. Tudo é explicado de forma simples e com exemplos práticos."],
              ["Para qual idade é indicado?", "Esse módulo foi desenvolvido especialmente para crianças de 0 a 3 anos, ainda na fase pré-leitora."],
              ["Como vou acessar o curso?", "Você vai receber o link de acesso por e-mail imediatamente após a compra."],
              ["Por quanto tempo terei acesso?", "Para sempre. O acesso é vitalício e você pode assistir quantas vezes quiser."],
              ["E se eu não ficar satisfeita?", "Você tem garantia total. Se sentir que não aprendeu nada aplicável, pode pedir o reembolso sem burocracia."],
            ].map(([q, a], i) => (
              <FaqItem key={i} q={q} a={a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="px-5 py-12" style={{ background: C.green }}>
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-3xl font-bold" style={{ color: C.white }}>
            Mãe que investe na base certa prepara um filho para aprender para sempre.
          </h2>
          <p className="mt-3 text-base" style={{ color: C.greenSoft }}>
            Você vai estar do lado do seu filho desde o primeiro som.
          </p>
          <button className="mt-6 w-full h-14 rounded-full font-bold text-base transition active:scale-[0.98]" style={{ background: C.white, color: C.green }}>
            Quero começar do jeito certo →
          </button>
          <p className="text-xs mt-3" style={{ color: C.greenSoft }}>
            Acesso imediato · Acesso vitalício · Pagamento único · R$97
          </p>
        </div>
      </section>
    </div>
  );
}

// ===== Screen 19 — Sales (níveis 2–5, fallback até copy chegar) =====
function SalesScreen() {
  return (
    <div className="min-h-full">
      {/* Bloco 1 — Problema vs solução */}
      <section className="px-5 py-10" style={{ background: C.mint }}>
        <div className="max-w-xl mx-auto">
          <H1>O Brasil tem um problema sério com a alfabetização. E a solução já existe.</H1>
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="rounded-3xl bg-white p-5" style={{ border: `2px solid ${C.redSoft}` }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ background: C.redSoft, color: C.red }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 9v4M12 17h.01"/><path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
              </div>
              <h3 className="font-bold text-lg mb-3" style={{ color: C.red }}>O problema</h3>
              <ul className="space-y-2 text-sm" style={{ color: C.warm }}>
                {[
                  "56% das crianças do 2º ano não foram alfabetizadas na faixa etária esperada",
                  "Quase 40% já tinham dificuldade antes da pandemia",
                  "Crianças na escola mas sem aprender a ler",
                ].map((t, i) => (
                  <li key={i} className="flex gap-2"><span style={{ color: C.red }}>✗</span>{t}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-white p-5" style={{ border: `2px solid ${C.greenSoft}` }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ background: C.mint, color: C.green }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h3 className="font-bold text-lg mb-3" style={{ color: C.green }}>A solução</h3>
              <ul className="space-y-2 text-sm" style={{ color: C.warm }}>
                {[
                  "97,1% das crianças do Ceará foram alfabetizadas em 2023 com método fônico",
                  "Salto de 12,5 pontos percentuais em um ano",
                  "Método comprovado pela ciência e pelos resultados",
                ].map((t, i) => (
                  <li key={i} className="flex gap-2"><span style={{ color: C.green }}>✓</span>{t}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-xs mt-4" style={{ color: C.warm }}>Fonte: Agência Brasil, 2024 · Governo do Ceará, 2024</p>
        </div>
      </section>

      {/* Bloco 2 — O que você vai receber */}
      <section className="px-5 py-10">
        <div className="max-w-xl mx-auto">
          <H1>O que você vai receber na masterclass</H1>
          <ul className="mt-6 space-y-4">
            {[
              ["📅", "Aula ao vivo de 3 horas", "com a Gabriela Engler pelo Google Meet"],
              ["🧠", "A Tríade do Ensino na prática", "maravilhamento, modelação e exercício"],
              ["🔤", "Sequência certa para ensinar as letras", "sem confundir a criança"],
              ["📄", "PDF com 4 atividades de percepção auditiva", "para usar em casa"],
              ["📄", "PDF com 5 atividades de consciência fonológica", "prontas para aplicar"],
              ["❓", "Sessão de tira dúvidas ao vivo", "todas as suas perguntas respondidas"],
            ].map(([icon, title, sub], i) => (
              <li key={i} className="flex gap-3">
                <span className="text-2xl shrink-0">{icon}</span>
                <div>
                  <div className="font-bold" style={{ color: C.green }}>{title}</div>
                  <div className="text-sm" style={{ color: C.warm }}>{sub}</div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-3xl bg-white p-5" style={{ border: `2px solid ${C.mint}` }}>
            <div className="font-bold" style={{ color: C.green }}>Gabriela Engler</div>
            <div className="text-sm" style={{ color: C.warm }}>Especialista em instrução fônica</div>
            <div className="text-sm" style={{ color: C.warm }}>8 anos de experiência</div>
            <div className="text-sm font-semibold mt-1" style={{ color: C.greenMid }}>@elagabriela.abc</div>
          </div>
        </div>
      </section>

      {/* Bloco 3 — Turma inaugural */}
      <section className="px-5 py-6">
        <div className="max-w-xl mx-auto">
          <div className="rounded-3xl p-6 text-center" style={{ background: C.mint }}>
            <div className="text-yellow-500 text-xl">★★★★★</div>
            <h3 className="text-2xl font-bold mt-2" style={{ color: C.green }}>Seja uma das primeiras.</h3>
            <p className="mt-2 text-sm" style={{ color: C.warm }}>
              Essa é a primeira turma da masterclass. Garante sua vaga agora e faz parte da história da Gabriela Engler.
            </p>
            <span className="inline-block mt-3 px-3 py-1 rounded-full text-xs font-bold" style={{ background: C.green, color: C.white }}>
              Turma inaugural — 30 de maio
            </span>
          </div>
        </div>
      </section>

      {/* Bloco 4 — Plano de compra */}
      <section className="px-5 py-10">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-center mb-5" style={{ color: C.green }}>Garanta sua vaga</h2>
          <div className="rounded-3xl p-6 shadow-2xl" style={{ background: C.green, color: C.white }}>
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold" style={{ background: C.greenSoft, color: C.green }}>
              30 de maio · Ao vivo · Google Meet
            </span>
            <h3 className="text-xl font-bold mt-3">Masterclass Primeiros Passos na Instrução Fônica</h3>
            <div className="h-px my-4" style={{ background: C.greenSoft, opacity: 0.5 }} />
            <ul className="space-y-2 text-sm">
              {[
                "Aula ao vivo de 3 horas",
                "Sessão de tira dúvidas ao vivo",
                "PDF com 4 atividades de percepção auditiva",
                "PDF com 5 atividades de consciência fonológica",
              ].map((t, i) => (
                <li key={i} className="flex gap-2"><span style={{ color: C.greenSoft }}>✓</span>{t}</li>
              ))}
            </ul>
            <div className="h-px my-4" style={{ background: C.greenSoft, opacity: 0.5 }} />
            <p className="text-xs" style={{ color: C.greenSoft }}>Apenas 50 vagas disponíveis</p>
            <div className="text-5xl font-bold mt-2">R$97</div>
            <p className="text-xs" style={{ color: C.greenSoft }}>pagamento único</p>
            <button className="mt-5 w-full h-14 rounded-full font-bold text-base transition active:scale-[0.98]" style={{ background: C.white, color: C.green }}>
              Sim, quero aprender a alfabetizar meu filho →
            </button>
            <p className="text-xs text-center mt-3" style={{ color: C.greenSoft }}>PIX · Cartão · Compra segura</p>
          </div>
        </div>
      </section>

      {/* Bloco 5 — Garantia */}
      <section className="px-5 py-6">
        <div className="max-w-md mx-auto">
          <div className="rounded-3xl bg-white p-6 text-center" style={{ border: `2px solid ${C.mint}` }}>
            <div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-3" style={{ background: C.mint }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3 className="font-bold text-lg" style={{ color: C.green }}>Garantia total</h3>
            <p className="text-sm mt-2" style={{ color: C.warm }}>
              Assista a aula completa e, se sentir que não aprendeu nada aplicável, devolvo seu dinheiro. Sem burocracia.
            </p>
          </div>
        </div>
      </section>

      {/* Bloco 6 — FAQ */}
      <section className="px-5 py-10">
        <div className="max-w-xl mx-auto">
          <H1>A gente costuma ser perguntada sobre</H1>
          <div className="mt-6 space-y-3">
            {[
              ["Vou precisar ter formação em pedagogia?", "Não. A masterclass foi feita para mães sem formação na área. Tudo vai ser explicado de forma simples e com exemplos práticos."],
              ["Para qual idade é indicado?", "Para filhos de qualquer idade, do pré-escolar ao ensino fundamental."],
              ["Como vai funcionar o acesso ao vivo?", "A aula acontece pelo Google Meet no dia 30 de maio. Você recebe o link por e-mail após a inscrição."],
              ["Vou ter chance de tirar dúvidas?", "Sim. Ao final da aula tem uma sessão ao vivo exclusiva para perguntas e respostas com a Gabriela."],
              ["E se eu não ficar satisfeita?", "Você tem garantia total. Se sentir que não aprendeu nada aplicável, pode pedir o reembolso sem burocracia."],
            ].map(([q, a], i) => (
              <FaqItem key={i} q={q} a={a} />
            ))}
          </div>
        </div>
      </section>

      {/* Bloco 7 — CTA final */}
      <section className="px-5 py-12" style={{ background: C.green }}>
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-3xl font-bold" style={{ color: C.white }}>
            Mãe que investe em educação prepara um filho para vencer.
          </h2>
          <p className="mt-3 text-base" style={{ color: C.greenSoft }}>
            Você vai estar do lado do seu filho em cada passo dessa jornada.
          </p>
          <button className="mt-6 w-full h-14 rounded-full font-bold text-base transition active:scale-[0.98]" style={{ background: C.white, color: C.green }}>
            Sim, quero aprender a alfabetizar meu filho →
          </button>
          <p className="text-xs mt-3" style={{ color: C.greenSoft }}>
            30 de maio · Ao vivo · Google Meet · Apenas 50 vagas · R$97
          </p>
        </div>
      </section>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <Accordion variant="separated" radius="lg" chevronPosition="right">
      <Accordion.Item value="faq" style={{ background: C.white, border: `2px solid ${C.mint}` }}>
        <Accordion.Control styles={{ label: { color: C.green, fontWeight: 600 } }}>
          {q}
        </Accordion.Control>
        <Accordion.Panel styles={{ content: { color: C.warm, fontSize: 14 } }}>
          {a}
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
