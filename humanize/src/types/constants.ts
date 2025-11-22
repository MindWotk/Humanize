// REGRAS DE NEGÓCIO E PERMISSÕES

// Definição dos IDs de Funções (Perfis) conforme Banco de Dados
export const ID_FUNCAO_TECH_LEAD = 3;
export const ID_FUNCAO_GERENTE = 4;
export const ID_FUNCAO_RH = 5;

// Grupos de Permissão (Array<number> para compatibilidade com .includes())
export const PERFIS_DASHBOARD: number[] = [ID_FUNCAO_TECH_LEAD, ID_FUNCAO_GERENTE, ID_FUNCAO_RH];
export const PERFIS_CADASTRO: number[] = [ID_FUNCAO_RH];

// OPÇÕES DE FORMULÁRIOS (UI) E TIPOS DE UNIÃO DERIVADOS
export const OPCOES_VOLUME = ["Leve", "Equilibrada", "Pesada", "Excessiva"] as const;
export const OPCOES_SONO = ["Dormi bem", "Médio", "Dormi mal"] as const;
export const OPCOES_SIM_NAO = ["Sim", "Não"] as const;
export const OPCOES_INTERACAO = ["Sim", "Parcialmente", "Não"] as const;
export const OPCOES_DESCONEXAO = ["Sim", "Talvez", "Não", "Improvável"] as const;

// TIPOS DE UNIÃO DERIVADOS

/** Tipos de união estritos para as propriedades do Check-in */
export type VolumeTipo = typeof OPCOES_VOLUME[number];
export type SonoTipo = typeof OPCOES_SONO[number];
export type DesconexaoTipo = typeof OPCOES_DESCONEXAO[number];
export type InteracaoTipo = typeof OPCOES_INTERACAO[number];
export type SimNaoTipo = typeof OPCOES_SIM_NAO[number];


// APRESENTAÇÃO

// Tipagem para auxiliar na definição do array de membros
export interface MembroEquipe {
    nome: string;
    rm: string;
    foto: string;
    github: string;
    linkedin: string;
}

// Definição da constante com a lista de membros para a página "Integrantes"
export const LISTA_MEMBROS: MembroEquipe[] = [
    {
        nome: "Andrei de Paiva Gibbini",
        rm: "563061",
        foto: "/img/foto-andrei.jpeg",
        github: "https://github.com/Andrei-Gibbini",
        linkedin: "https://www.linkedin.com/in/andrei-de-paiva-gibbini-777475218/",
    },
    {
        nome: "Isabela dos Santos Pinto",
        rm: "563422",
        foto: "/img/foto-isabela.jpeg",
        github: "https://github.com/devbelasp",
        linkedin: "https://www.linkedin.com/in/isabela-dos-santos-pinto-31268b353/?locale=pt_BR",
    },
    {
        nome: "Manuela de Lacerda Soares",
        rm: "564887",
        foto: "/img/foto-manuela.jpg",
        github: "https://github.com/manuelalacerda",
        linkedin: "https://www.linkedin.com/in/manuela-lacerda-2a6194200/",
    },
]

// CONTEÚDO DA PÁGINA SOBRE
export const FEATURES_SOBRE = [
    {
        id: "dados",
        title: "Decisões Baseadas em Dados",
        desc: "Em um mundo movido por IA, a intuição não basta. Transformamos sentimentos em métricas para guiar a gestão.",
        bgIcon: "bg-blue-50",
        iconColor: "text-blue-600"
    },
    {
        id: "seguranca",
        title: "Segurança Psicológica",
        desc: "O anonimato é a chave. Criamos um ambiente seguro onde o colaborador pode ser honesto sem medo de represálias.",
        bgIcon: "bg-teal-50",
        iconColor: "text-teal-600"
    },
    {
        id: "agilidade",
        title: "Agilidade no Híbrido",
        desc: "Check-ins de 30 segundos que se encaixam na rotina flexível, mantendo a conexão mesmo à distância.",
        bgIcon: "bg-purple-50",
        iconColor: "text-purple-600"
    }
] as const;


// DADOS DA PÁGINA FAQ
export const FAQ_ITEMS = [
    {
        id: "humanize",
        question: "O que é o Humanize?",
        answer: "O Humanize é uma plataforma corporativa focada na saúde mental e bem-estar de equipes em trabalho híbrido. Nosso objetivo é identificar sinais precoces de burnout e ajudar gestores e RH a criarem um ambiente de trabalho mais saudável e sustentável através de dados.",
        iconColor: "text-teal-500"
    },
    {
        id: "anonimato",
        question: "Meus check-ins diários são anônimos?",
        answer: "Sim, a privacidade é nosso pilar fundamental. Seus check-ins diários de humor e energia são processados de forma anônima. O seu gestor e o RH visualizam apenas médias agregadas da equipe (ex: 'Média de energia do time: 3.5'), nunca a sua resposta individual identificada.",
        iconColor: "text-purple-500"
    },
    {
        id: "dados",
        question: "Como os dados são utilizados pela empresa?",
        answer: "Os dados geram dashboards de inteligência para o RH e Gestores. Eles servem para identificar tendências, como semanas com alta carga de estresse ou queda geral na vitalidade do time, permitindo ações preventivas (como ajustar prazos ou promover ações de integração).",
        iconColor: "text-blue-500"
    },
    {
        id: "alerta",
        question: "O que acontece se eu relatar que estou mal?",
        answer: "O sistema irá sugerir recursos de bem-estar (vídeos, artigos, meditações) adequados ao seu estado. Além disso, se os indicadores do time estiverem baixos, o gestor recebe um alerta para cuidar da equipe, sem saber especificamente quem reportou o problema.",
        iconColor: "text-green-500"
    },
    {
        id: "frequencia",
        question: "Sou obrigado a fazer o check-in todos os dias?",
        answer: "Não é obrigatório, mas é altamente recomendado. Quanto mais frequente for o seu registro, mais precisos serão os dados para que a empresa possa melhorar o ambiente de trabalho. Leva menos de 30 segundos!",
        iconColor: "text-yellow-500"
    }
] as const;