import type { FuncionarioTO, LoginTO, CheckinHumorTO } from './api';

export type LoginFormData = LoginTO;

export interface CheckinFormData extends Omit<CheckinHumorTO, 'id' | 'funcionarioId' | 'dataCheckin'> {
    nivelEnergia: number;
    nivelConexao: number;
}

export interface CadastroFormData extends Omit<FuncionarioTO, 'id'> {
    equipeId: number;
    idFuncao: number;
    dataContratacao: string;
}