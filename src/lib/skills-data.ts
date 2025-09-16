// src/lib/skills-data.ts

export interface SkillCategory {
  title: string;
  skills: string[];
}

export const skillsData: SkillCategory[] = [
  {
    title: "Linguagens de Programação",
    skills: [
      "C# (Avançado)",
      "Java (Intermediário)",
      "JavaScript & TypeScript",
      "HTML5 & CSS3",
      "Python",
      "PHP",
      "Dart",
      "Lua",
      "C",
    ],
  },
  {
    title: "Ferramentas & Tecnologias",
    skills: [
      "Unity Engine",
      "Firebase",
      "Git & GitHub",
      "Flutter",
      "Next.js & React",
      "Node.js (Básico)",
      "SQL (Básico)",
      "VS Code & Visual Studio",
      "Blender (Básico)",
    ],
  },
  {
    title: "Design & Outros",
    skills: [
      "Photoshop",
      "Illustrator",
      "Premiere Pro",
      "UI/UX (Conceitos)",
      "Metodologias Ágeis",
      "Windows",
      "Inglês (Cursando)",
      "Espanhol (Formado)",
    ],
  },
];