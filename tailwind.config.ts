// tailwind.config.ts

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Para a versão 4 do Tailwind, a secção 'theme' foi movida para o globals.css.
  // Manter este ficheiro limpo é essencial para evitar conflitos.
};
export default config;