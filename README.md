# Humanize - Gestão de Pessoas Baseada em Dados

> "Combater o Burnout e promover o Trabalho Decente através de dados."

#### 🚦 Status do Projeto

- **Status:** Concluído (Entrega para a Global Solution 2025 da FIAP - 1TDSPH).
- **Desenvolvido por:** Alunos da turma 1TDSPH da FIAP.

## 📋 Descrição

O **Humanize** é uma plataforma de "Saúde Mental Corporativa" desenvolvida para atender aos desafios do trabalho híbrido e remoto. A solução visa monitorar o bem-estar dos colaboradores de forma contínua e anônima, oferecendo dashboards inteligentes para o RH e gestores identificarem padrões de estresse, além de fornecer uma biblioteca de recursos de bem-estar para as equipes.

---

## 📑 Sumário

1. [Sobre o Projeto](#-sobre-o-projeto)
2. [Tecnologias Utilizadas](#-tecnologias-utilizadas)
3. [Instalação e Configuração](#-instalação-e-configuração)
4. [Como Usar](#-como-usar)
5. [Estrutura de Pastas](#-estrutura-de-pastas)
6. [Endpoints e Rotas](#-endpoints-e-rotas)
7. [Autores e Créditos](#-autores-e-créditos)
8. [Demonstração Visual](#-demonstração-visual)
9. [Contato](#-contato)
10. [Links do Projeto](#-links-do-projeto)

---

## 📖 1. Sobre o Projeto

O Humanize foi desenvolvido como parte da **Global Solution 2025** da FIAP. A proposta central consiste em um sistema onde colaboradores realizam um "Check-in de Humor" diário, coletando métricas qualitativas sobre energia, sono e demandas.

**Objetivos de Desenvolvimento Sustentável (ODS) atendidos:**

- **ODS 3:** Saúde e Bem-Estar.
- **ODS 8:** Trabalho Decente e Crescimento Econômico.

**Principais Funcionalidades:**

- **Check-in Diário:** Monitoramento de humor, energia e bloqueios produtivos.
- **Dashboard Inteligente:** Visualização de médias de humor por equipe para Gestores e RH.
- **Anonimização:** Proteção de dados individuais nos relatórios gerenciais.
- **Biblioteca de Recursos:** Curadoria de vídeos e artigos para bem-estar (CRUD completo e Favoritos).

---

## 🚀 2. Tecnologias Utilizadas

### Front-end

- **React** com **TypeScript**
- **Vite** (Build tool)
- **Tailwind CSS** (Estilização)
- **React Router DOM** (Navegação)
- **React Icons** (Iconografia)
- **React Hook Form** (Gerenciamento de formulários)

### Back-end

- **Java** (JDK 17+)
- **JDBC** (Conexão com Banco de Dados)
- **Arquitetura MVC** (Model, View, Controller) com DAO Pattern.
- **API REST**

### Ferramentas

- **Oracle Database / SQL** (Persistência de dados)
- **Visual Studio Code / IntelliJ IDEA**
- **Git & GitHub**

---

## ⚙️ 3. Instalação (se for testar localmente)

Para executar o front-end do **Humanize**, siga os passos abaixo:

1. **Clone o repositório:**

   ```bash
   git clone [SEU_LINK_DO_GITHUB]
   cd HUMANIZE
   ```

2. **Instale as dependências do projeto:**

   ```bash
   npm install
   ```

3. **Execute o projeto:**

   ```bash
   npm run dev
   ```

4. **Acesse no navegador:**
   ```
   http://localhost:5173
   ```

---

## ❓4. Como Usar

1. **Login:** Para fazer login utilize as credenciais de teste (email e senha).
   - _Perfil RH:_ Tem acesso total (Cadastrar funcionários, gerir recursos, ver auditoria).
   - _Perfil Gestor:_ Visualiza dashboard da própria equipe.
   - _Perfil Colaborador:_ Realiza check-ins e acessa recursos.
2. **Check-in:** Vá até a aba "Check-in" e responda como está se sentindo hoje.
3. **Recursos:** Navegue pela "Biblioteca" e favorite conteúdos que gostar.
4. **Dashboard (Gestores/RH):** Analise os gráficos de tendência de humor para prevenir burnout na equipe.

## 🔑 Credenciais de Teste e Acesso por Perfil

A tabela abaixo lista as credenciais de teste para visualizar as diferentes funcionalidades do sistema.

| Email                       | Senha       | Cargo              | ID Função             | Telas Acessíveis (Restritas)                                                                       |
| :-------------------------- | :---------- | :----------------- | :-------------------- | :------------------------------------------------------------------------------------------------- |
| **carla.dias@empresa.com**  | `gestor789` | RH                 | **5**                 | Dashboard (Empresa Inteira), Cadastro de Pessoas, Gestão de Recursos, Auditoria/Histórico Anônimo. |
| **alice.silva@empresa.com** | `hash123`   | TECH LEAD          | **3**                 | Dashboard (Apenas o seu time), Check-in, Recursos, Perfil.                                         |
| **igor.santos@empresa.com** | `hashPQR`   | GERENTE            | **4**                 | Dashboard (Apenas o seu time), Check-in, Recursos, Perfil.                                         |
| **bruno.costa@empresa.com** | `hash456`   | FUNCIONÁRIO NORMAL | 1 ou 2 (Ex: Analista) | Check-in, Recursos, Perfil (Não acessa Dashboard nem áreas Admin).                                 |

---

## 📂 5. Estrutura de Pastas

```
├─ humanize/
├── public/
│   ├── img/
│   │    ├── foto-andrei.jpeg
│   │    ├── foto-isabela.jpeg
│   │    ├── foto-manuela.jpg
│   │    ├── fundo.png
│   │    └── logo-humanize.png
│   │
├── src/
│   ├── components/
│   │   ├── Cabecalho/
│   │   │   └── Cabecalho.tsx
│   │   ├── ListaFuncionario/
│   │   │   └── ListaFuncionario.tsx
│   │   ├── Menu/
│   │   │   └── Menu.tsx
│   │   ├── ModalEditarFuncionario/
│   │   │   └── ModalEditarFuncionario.tsx
│   │   ├── Rodape/
│   │   │   └── Rodape.tsx
│   │   ├── ThemeContext/
│   │   │   ├── ThemeContext.tsx
│   │   │   └── useTheme.ts
│   ├── routes/
│   │   ├── AdminFuncionarios/
│   │   │   └── index.tsx
│   │   ├── AdminRecursos/
│   │   │   └── index.tsx
│   │   ├── Auditoria/
│   │   │   └── index.tsx
│   │   ├── Cadastro/
│   │   │   └── index.tsx
│   │   ├── Checkin/
│   │   │   └── index.tsx
│   │   ├── Contato/
│   │   │   └── index.tsx
│   │   ├── Dashboard/
│   │   │   └── index.tsx
│   │   ├── Error/
│   │   │   └── index.tsx
│   │   ├── FAQ/
│   │   │   └── index.tsx
│   │   ├── Integrantes/
│   │   │   └── index.tsx
│   │   ├── Login/
│   │   │   └── index.tsx
│   │   ├── PaginaInicial/
│   │   │   └── index.tsx
│   │   ├── Perfil/
│   │   │   └── index.tsx
│   │   ├── Recursos/
│   │   │   └── index.tsx
│   │   └── Sobre/
│   │       └── index.tsx
│   ├── services/
│   │   └── apiService.ts
│   ├── types/
│   │   ├── api.ts
│   │   ├── constants.ts
│   │   ├── forms.ts
│   │   ├── themeContextType.ts
│   │   └── ui.ts
│   ├── App.tsx
│   ├── globals.css
│   └── main.tsx
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## 🔗 6. Endpoints / Rotas Principais

| Rota                  | Descrição                              | Acesso Requerido |
| :-------------------- | :------------------------------------- | :--------------- |
| `/`                   | Página Inicial                         | Público          |
| `/login`              | Acesso ao sistema                      | Público          |
| `/sobre`              | Detalhes sobre a solução               | Público          |
| `/integrantes`        | Contato dos integrantes do projeto     | Público          |
| `/faq`                | Perguntas Frequentes sobre o sistema   | Público          |
| `/contato`            | Página para entrar em contato          | Público          |
| `/recursos`           | Biblioteca de Conteúdos de Bem-Estar   | Logado           |
| `/checkin`            | Registro de Humor e Energia Diário     | Logado           |
| `/perfil`             | Dados de Usuário e Recursos Favoritos  | Logado           |
| `/dashboard`          | Indicadores de Bem-Estar da Equipe     | Gestores e RH    |
| `/cadastro`           | Cadastro de Novo Funcionário           | RH (ID 5)        |
| `/admin/funcionarios` | Gerenciamento de Colaboradores         | RH (ID 5)        |
| `/admin/recursos`     | Gerenciamento de Recursos de Bem-Estar | RH (ID 5)        |
| `/admin/auditoria`    | Detalhamento de Relatos e Riscos       | RH (ID 5)        |

---

## 👥 7. Autores e Créditos

Desenvolvido por estudantes de Análise e Desenvolvimento de Sistemas da FIAP:

- **Andrei de Paiva Gibbini** (RM: 563061)
- **Isabela dos Santos Pinto** (RM: 563422)
- **Manuela de Lacerda Soares** (RM: 564887)

---

## 💻 8. Demonstração Visual

## Página Inicial

![PaginaInicial (modo escuro)](/humanize/public/img/tela-inicial-claro.png)
![PaginaInicial (modo claro)](/humanize/public/img/tela-inicial-escuro.png)

## Login

![Login](/humanize/public/img/tela-login.png)

## Dashbord (Gestores e RH)

![Dashboard](/humanize/public/img/tela-dashboard.png)
Exibe a média de "Bem-Estar" das equipes calculada com base nos check-ins dos funcionários. O RH vê todas as equipes; Gestores vêem apenas a sua squad.

## Auditoria (RH)

![Auditoria](/humanize/public/img/tela-auditoria.png)
A Página de Auditoria mostra a lista de respostas dos check-ins dos funcionários de forma anônima. Apenas o RH tem acesso a essas informações, com elas é possível identificar padrões e previnir maiores riscos à saúde dos funcionários.

## Gerir Pessoas (RH)

![AdminFuncionarios](/humanize/public/img/tela-admin-funcionarios.png)
Nessa página é possível gerenciar acessos, perfis e dados cadastrais.

## Gerir Conteudo (RH)

![AdminRecursos](/humanize/public/img/tela-admin-recursos.png)
O RH cadastra vídeos, artigos, links úteis e conteúdos de Bem-Estar no sistema.

## Perfil e Recursos Favoritos

![Perfil](/humanize/public/img/tela-perfil.png)
Exibe os dados do funcionário logado e a lista de recursos que ele marcou como "Favorito".

## Check-in Diário

![Checkin](/humanize/public/img/tela-checkin.png)
O formulário coleta 10 métricas qualitativas sobre o estado do colaborador, que são agrupadas em quatro seções principais: Energia e Humor, Carga de Trabalho, Conexão e Ambiente e Reforço Positivo.

## Biblioteca de Bem-Estar

![Recursos](/humanize/public/img/tela-recursos.png)
Renderiza todos os cards de conteúdo disponíveis para o colaborador.

## Página Sobre

![Sobre](/humanize/public/img/tela-sobre.png)
Descrição sobre o projeto e a solução

## Perguntas Frequentes

![FAQ](/humanize/public/img/tela-faq.png)
Perguntas frequentes do sistema

## Integrantes

![Integrantes](/humanize/public/img/tela-integrantes.png)
Contato da equipe de desenvolvimento Humanize

## Contato

![Contato](/humanize/public/img/tela-contato.png)
Página de contato

---

## 9. Contato

| Nome                      | RM     | GitHub                                                                 | Linkedin                                                                                                                                                     |
| :------------------------ | :----- | :--------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Andrei de Paiva Gibbini   | 563061 | [https://github.com/Andrei-Gibbini](https://github.com/Andrei-Gibbini) | [https://www.linkedin.com/in/andrei-de-paiva-gibbini-777475218/](https://www.linkedin.com/in/andrei-de-paiva-gibbini-777475218/)                             |
| Isabela dos Santos Pinto  | 563422 | [https://github.com/devbelasp](https://github.com/devbelasp)           | [https://www.linkedin.com/in/isabela-dos-santos-pinto-31268b353/?locale=pt_BR](https://www.linkedin.com/in/isabela-dos-santos-pinto-31268b353/?locale=pt_BR) |
| Manuela de Lacerda Soares | 564887 | [https://github.com/manuelalacerda](https://github.com/manuelalacerda) | [https://www.linkedin.com/in/manuela-lacerda-2a6194200/](https://www.linkedin.com/in/manuela-lacerda-2a6194200/)                                             |

---

## 10. Links do Projeto

| Plataforma                   | Link |
| :--------------------------- | :--- |
| **GitHub**                   | []() |
| **Vídeo no YouTube**         | []() |
| **Link do deploy na Vercel** | []() |

---
