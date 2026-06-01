"use client";

import { createTheme, type MantineColorsTuple } from "@mantine/core";

// Identidade verde pastel da Gabriela Engler
const brand: MantineColorsTuple = [
  "#eafaf1", // 0
  "#d6f2e0", // 1  mint
  "#a8e0bc", // 2  greenSoft
  "#7fd3a0", // 3
  "#5cc286", // 4  greenLight
  "#3aae6e", // 5
  "#2d9957", // 6  greenMid
  "#22824a", // 7
  "#1a5c35", // 8  green (escuro) — cor dos botões/títulos
  "#124426", // 9
];

export const theme = createTheme({
  primaryColor: "brand",
  primaryShade: 8,
  colors: { brand },
  fontFamily: "var(--font-dmsans), Inter, system-ui, sans-serif",
  headings: { fontFamily: "var(--font-dmsans), Inter, system-ui, sans-serif" },
  defaultRadius: "lg",
});
