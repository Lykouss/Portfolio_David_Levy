// src/lib/projects-data.ts

export interface Project {
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  downloadUrl?: string;
  longDescriptionHtml?: string; 
}

export const projectsData: Project[] = [
  {
    title: "Project ChronoMage",
    slug: "project-chronomage",
    description: "Um jogo de RPG e magia. Um dos meus preferidos, onde pude aprimorar minhas habilidades com a engine e integração com backend.",
    imageUrl: "/images/projects/Project_ChronoMage.png",
    tags: ["Unity", "C#", "Firebase"],
    downloadUrl: "https://drive.google.com/file/d/1ho7O6BUHyF-T9Hh_DSiKE3EoxRt_imYR/view?usp=sharing",
    longDescriptionHtml: `<p class="mb-4">O Project ChronoMage é a materialização da minha paixão pelo desenvolvimento de jogos. Concebido como um RPG de ação, o projeto foi uma jornada de aprendizado profundo na <strong>Unity Engine</strong>, focando em mecânicas de combate, sistemas de magia e gerenciamento de estado do jogador.</p><h3 class="font-title text-2xl font-bold text-text mt-6 mb-3">O Desafio Técnico</h3><p class="mb-4">O principal objetivo era criar um jogo 'completo', desde o movimento do personagem até a persistência de dados. Isso envolveu a implementação de sistemas de colisão, animação, inteligência artificial básica para inimigos e, crucialmente, a integração com um backend para salvar o progresso. A escolha do <strong>Firebase Firestore</strong> permitiu armazenar dados do jogador de forma eficiente, abrindo portas para futuras funcionalidades online.</p><h3 class="font-title text-2xl font-bold text-text mt-6 mb-3">O Que Aprendi</h3><p>Desenvolver o ChronoMage foi um divisor de águas. Solidificou meu domínio em <strong>C#</strong>, me ensinou a arquitetar sistemas de jogo modulares e escaláveis dentro da Unity e me deu experiência prática com a integração de um banco de dados NoSQL em um ambiente de tempo real, um aprendizado que transcende o desenvolvimento de jogos e se aplica a qualquer aplicação dinâmica.</p>`,
  },
  {
    title: "IntelliStock",
    slug: "intellistock",
    description: "Sistema completo de gestão de estoque para uma loja de celulares, com autenticação, dashboard e cadastro de produtos.",
    imageUrl: "/images/projects/IntelliStock.png",
    tags: ["HTML", "CSS", "JavaScript", "Firebase", "React"],
    githubUrl: "https://github.com/Lykouss/IntelliStock",
    liveUrl: "https://intellistockapp.firebaseapp.com",
    longDescriptionHtml: `<p class="mb-4">O IntelliStock nasceu de um desafio comum a muitos pequenos negócios: a complexidade e o custo de um sistema de gestão de estoque eficiente. O objetivo foi criar uma solução web robusta, intuitiva e acessível para uma loja de celulares, permitindo um controle preciso e em tempo real do inventário.</p><h3 class="font-title text-2xl font-bold text-text mt-6 mb-3">O Processo de Desenvolvimento</h3><p class="mb-4">Como único desenvolvedor, fui responsável por todo o ciclo, da interface (UI/UX) à implementação. A escolha do <strong>Firebase</strong> como plataforma de BaaS (Backend-as-a-Service) foi estratégica, agilizando a criação de funcionalidades críticas como autenticação de usuários (Firebase Auth) e armazenamento de dados em tempo real (Firestore).</p><p>A interface foi construída com foco na usabilidade, utilizando <strong>HTML</strong>, <strong>CSS</strong> e <strong>JavaScript</strong> puro para interatividade dinâmica, garantindo uma experiência fluida e responsiva sem a necessidade de frameworks pesados.</p><h3 class="font-title text-2xl font-bold text-text mt-6 mb-3">Principais Desafios e Aprendizados</h3><p>O maior desafio foi estruturar o banco de dados NoSQL do Firestore de forma a garantir consultas rápidas e escaláveis. Implementar um sistema de autenticação seguro foi outro marco importante. Este projeto solidificou minhas habilidades em arquitetura de aplicações web, gestão de estado no cliente e na criação de soluções completas e prontas para o mercado.</p>`,
  },
  {
    title: "Utilify",
    slug: "utilify",
    description: "Site com diversas ferramentas para o dia-a-dia, como Gerador de QR Code, Conversor de Imagens, Gerador de Senhas, etc.",
    imageUrl: "/images/projects/Utilify.png",
    tags: ["HTML", "CSS", "JavaScript", "Firebase", "React", "Next.Js", "Vercel"],
    githubUrl: "https://github.com/Lykouss/Utilify",
    liveUrl: "https://utilify-zeta.vercel.app",
    longDescriptionHtml: `<p class="mb-4">Utilify é um projeto pessoal contínuo que serve como um playground para explorar novas APIs e aprimorar minhas habilidades de front-end. A ideia é simples: centralizar uma coleção de pequenas ferramentas úteis do dia a dia em uma interface limpa, rápida e acessível.</p><h3 class="font-title text-2xl font-bold text-text mt-6 mb-3">Arquitetura e Ferramentas</h3><p class="mb-4">Cada ferramenta (Gerador de QR Code, Conversor de Imagens, etc.) é desenvolvida como um componente modular e independente. Isso torna o projeto fácil de manter e expandir. O principal desafio técnico é a integração com APIs de terceiros para funcionalidades como as taxas de câmbio do conversor de moedas, o que exige o tratamento de requisições assíncronas, gerenciamento de chaves de API e tratamento de erros de forma elegante.</p><h3 class="font-title text-2xl font-bold text-text mt-6 mb-3">Evolução Contínua</h3><p>Este projeto está sempre em evolução. Ele não apenas demonstra minhas habilidades com <strong>TypeScript</strong> na manipulação do DOM e consumo de APIs, mas também serve como um testamento da minha proatividade e desejo de construir coisas úteis. O plano é continuar adicionando novas ferramentas e, eventualmente, implementar funcionalidades de personalização para os usuários.</p>`,
  },
  {
    title: "Chef Express",
    slug: "chef-express",
    description: "Projeto de um sistema web para um restaurante, aprimorando habilidades com Firebase, HTML, CSS e JavaScript.",
    imageUrl: "/images/projects/ChefExpress.png",
    tags: ["Flutter", "Kotlin", "Dart", "Firebase"],
    githubUrl: "https://github.com/Lykouss/ChefExpress",
    downloadUrl: "https://drive.google.com/file/d/1p-CefHPuCXF7RCJJMgG5yUtOcFjI6x5p/view?usp=sharing",
    longDescriptionHtml: `<p class="mb-4">O Chef Express foi um projeto focado em explorar o desenvolvimento mobile multiplataforma com <strong>Flutter</strong>. O objetivo era criar um aplicativo para um restaurante fictício, permitindo a visualização do cardápio e, futuramente, a realização de pedidos. A escolha pelo Flutter foi estratégica para entender como criar interfaces nativas para Android e iOS a partir de um único código-base em <strong>Dart</strong>.</p><h3 class="font-title text-2xl font-bold text-text mt-6 mb-3">Solução Implementada</h3><p class="mb-4">A arquitetura do aplicativo foi pensada para ser reativa e performática. Utilizei o <strong>Firebase Firestore</strong> como backend para gerenciar o cardápio de forma dinâmica, permitindo atualizações em tempo real sem a necessidade de reenviar o app para as lojas. A integração com <strong>Kotlin</strong> nativo foi explorada para entender como acessar recursos específicos do dispositivo, caso necessário.</p><h3 class="font-title text-2xl font-bold text-text mt-6 mb-3">Competências Adquiridas</h3><p>Este projeto foi minha principal incursão no mundo mobile. Aprendi sobre a árvore de widgets do Flutter, gerenciamento de estado (setState, Provider) e a importância de uma UI/UX pensada para telas menores. Foi um exercício prático que expandiu minhas competências para além do desenvolvimento web e de jogos.</p>`,
  },
  {
    title: "Escola Técnica de Santa Maria",
    slug: "etsm-site",
    description: "Site informativo que desenvolvi para a minha Escola Técnica, atendendo a uma demanda externa.",
    imageUrl: "/images/projects/ETSM.jpg",
    tags: ["HTML", "CSS", "JavaScript", "Firebase"],
    githubUrl: "https://github.com/Lykouss/Escola_Tecnica_Site.git",
    liveUrl: "https://fir-test-9bc5b.web.app/",
    longDescriptionHtml: `<p class="mb-4">Este projeto representa minha primeira experiência trabalhando com um "cliente" real. Fui procurado para desenvolver um site informativo para a Escola Técnica de Santa Maria, com o objetivo de centralizar informações sobre cursos, eventos e notícias para alunos e para a comunidade.</p><h3 class="font-title text-2xl font-bold text-text mt-6 mb-3">Do Requisito à Entrega</h3><p class="mb-4">O desafio foi traduzir as necessidades da escola em um design claro, navegável e de fácil atualização. Optei por uma arquitetura simples e eficaz: um front-end estático hospedado no <strong>Firebase Hosting</strong> para máxima performance e segurança, com seções de notícias e eventos que poderiam ser facilmente atualizadas no futuro através do Firestore.</p><h3 class="font-title text-2xl font-bold text-text mt-6 mb-3">Impacto e Aprendizado</h3><p>Além da experiência técnica, este projeto me ensinou sobre comunicação, levantamento de requisitos e a importância de entregar um produto que não apenas funciona, mas que atende às expectativas do usuário final. Foi um passo importante da programação por hobby para a aplicação profissional do meu conhecimento.</p>`,
  },
  {
    title: "Gestão e Controle de Estoque",
    slug: "gestao-estoque-tcc",
    description: "Meu primeiro sistema web, desenvolvido para o TCC. Foi fundamental para aprender sobre autenticação e banco de dados.",
    imageUrl: "/images/projects/ElectroStock.png",
    tags: ["HTML", "CSS", "JavaScript", "Firebase"],
    githubUrl: "https://github.com/Lykouss/Gestao_e_Controle_Estoque",
    liveUrl: "https://gerenciamento-de-estoque-3075e.web.app",
    longDescriptionHtml: `<p class="mb-4">Este foi o projeto que marcou minha transição para o desenvolvimento de aplicações web completas. Como meu Trabalho de Conclusão de Curso (TCC), o objetivo era criar um sistema de gestão de estoque funcional, e ele se tornou minha porta de entrada para o ecossistema <strong>Firebase</strong>.</p><h3 class="font-title text-2xl font-bold text-text mt-6 mb-3">Fundamentos Essenciais</h3><p class="mb-4">O foco era dominar os pilares de uma aplicação web segura e dinâmica. Implementei do zero um sistema de login e cadastro utilizando o <strong>Firebase Authentication</strong>, garantindo que apenas usuários autorizados pudessem acessar o sistema. O núcleo da aplicação, o controle de estoque, foi construído sobre o <strong>Firestore</strong>, onde aprendi na prática a modelar dados, realizar operações de CRUD (Create, Read, Update, Delete) e a ouvir atualizações em tempo real.</p><h3 class="font-title text-2xl font-bold text-text mt-6 mb-3">Legado do Projeto</h3><p>Embora tecnicamente mais simples que meus projetos posteriores, a importância deste é imensa. Foi aqui que a "mágica" do desenvolvimento web se desvendou para mim. Cada funcionalidade implementada, cada bug corrigido, construiu a base de conhecimento sobre autenticação, bancos de dados e arquitetura de software que eu utilizo até hoje.</p>`,
  }
];