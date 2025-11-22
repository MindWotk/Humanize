import type {
    VolumeTipo,
    SonoTipo,
    DesconexaoTipo,
    InteracaoTipo,
    SimNaoTipo
} from './constants';

export const API_URL = import.meta.env.VITE_API_BASE_URL;

// INTERFACES DE DOMÍNIO (TOs - Transfer Objects)

// DADOS BÁSICOS DE PERFIL
export interface FuncionarioTO {
    id: number;
    nome: string;
    email: string;
    senha: string;
    dataContratacao: string;
    equipeId: number;
    idFuncao: number;
}

// DADOS DE LOGIN
export interface LoginTO {
    email: string;
    senha: string;
}

// CHECK-IN DE HUMOR
export interface CheckinHumorTO {
    id?: number;
    funcionarioId: number;
    dataCheckin: string;
    nivelEnergia: number;
    sentimento: string;

    volumeDemandas: VolumeTipo;
    bloqueios: string | null;
    desconexao: DesconexaoTipo;
    nivelConexao: number;
    qualidadeInteracao: InteracaoTipo;
    qualidadeSono: SonoTipo;
    statusPausas: SimNaoTipo;
    pequenoGanho: string | null;
}

// HISTÓRICO BRUTO ANONIMIZADO
// Usado para dados de auditoria que não expõem o ID do funcionário
export interface CheckinHumorAnonimoTO {
    id: number;
    dataCheckin: string;
    nivelEnergia: number;
    sentimento: string;

    volumeDemandas: VolumeTipo;
    bloqueios: string | null;
    desconexao: DesconexaoTipo;
    nivelConexao: number;
    qualidadeInteracao: InteracaoTipo;
    qualidadeSono: SonoTipo;
    statusPausas: SimNaoTipo;
    pequenoGanho: string | null;
}

// RELATÓRIO DO DASHBOARD
export interface RelatorioHumorTO {
    equipeId: number;
    nomeEquipe: string;
    mediaNivelHumor: number;
    totalCheckins: number;
}

// DEMAIS INTERFACES DE REFERÊNCIA
export interface EquipeTO {
    id: number;
    nome: string;
    sigla: string;
    setor: string;
}

export interface FuncaoTO {
    id: number;
    nome: string;
}

export interface RecursoBemEstarTO {
    id: number;
    nome: string;
    tipo: string;
    link: string;
}