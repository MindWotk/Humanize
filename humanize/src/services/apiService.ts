import {
    type FuncionarioTO,
    type LoginTO,
    type CheckinHumorTO,
    type RelatorioHumorTO,
    type RecursoBemEstarTO,
    type EquipeTO,
    type FuncaoTO,
    type CheckinHumorAnonimoTO,
    API_URL,
} from '../types/api';


const JSON_HEADERS = {
    'Content-Type': 'application/json',
};

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    return String(error);
}


// AUTENTICAÇÃO E CADASTRO

export async function autenticarFuncionario(credentials: LoginTO): Promise<{ user: FuncionarioTO | null; error: string | null }> {
    try {
        const response = await fetch(`${API_URL}/funcionarios/login`, {
            method: 'POST',
            headers: JSON_HEADERS,
            body: JSON.stringify(credentials),
        });

        if (response.status === 200) {
            const user = (await response.json()) as FuncionarioTO;
            return { user, error: null };
        } else if (response.status === 401) {
            return { user: null, error: 'Credenciais inválidas. Verifique o e-mail e a senha.' };
        }
        return { user: null, error: `Erro ${response.status} ao autenticar.` };
    } catch (error: unknown) {
        return { user: null, error: `Falha na conexão: ${getErrorMessage(error)}` };
    }
}

export async function cadastrarFuncionario(novoFuncionario: FuncionarioTO, solicitanteId: number): Promise<{ user: FuncionarioTO | null; error: string | null }> {
    try {
        const response = await fetch(`${API_URL}/funcionarios/cadastro/${solicitanteId}`, {
            method: 'POST',
            headers: JSON_HEADERS,
            body: JSON.stringify(novoFuncionario),
        });

        if (response.status === 201) {
            const user = (await response.json()) as FuncionarioTO;
            return { user, error: null };
        } else if (response.status === 403) {
            const errorText = await response.text();
            return { user: null, error: errorText || 'Acesso negado. Apenas o RH pode cadastrar.' };
        } else if (response.status === 400) {
            const errorText = await response.text();
            return { user: null, error: errorText || 'Erro de validação ou e-mail já cadastrado.' };
        }
        return { user: null, error: `Erro ${response.status} ao cadastrar.` };
    } catch (error: unknown) {
        return { user: null, error: `Falha na conexão: ${getErrorMessage(error)}` };
    }
}

// CHECK-IN E DASHBOARD

export async function registrarCheckin(checkin: CheckinHumorTO): Promise<{ success: boolean; error: string | null }> {
    try {
        const response = await fetch(`${API_URL}/checkins`, {
            method: 'POST',
            headers: JSON_HEADERS,
            body: JSON.stringify(checkin),
        });

        if (response.status === 201) {
            return { success: true, error: null };
        } else if (response.status === 400) {
            const errorText = await response.text();
            return { success: false, error: errorText || 'Erro: Já existe um check-in para esta data.' };
        }
        return { success: false, error: `Erro ${response.status} ao registrar check-in.` };
    } catch (error: unknown) {
        return { success: false, error: `Falha na conexão: ${getErrorMessage(error)}` };
    }
}

export async function buscarRelatorioDashboard(funcionarioId: number): Promise<RelatorioHumorTO[]> {
    try {
        const response = await fetch(`${API_URL}/checkins/analise/${funcionarioId}`);

        if (response.status === 200) {
            return (await response.json()) as RelatorioHumorTO[];
        } else if (response.status === 403) {
            throw new Error("Acesso negado. Você não tem permissão para ver este dashboard.");
        }
        return [];
    } catch (error: unknown) {
        console.error("Erro ao carregar dashboard:", getErrorMessage(error));
        if (error instanceof Error && error.message.includes("Acesso negado")) {
            throw error;
        }
        return [];
    }
}

export async function buscarHistoricoAnonimo(solicitanteId: number): Promise<CheckinHumorAnonimoTO[]> {
    try {
        const response = await fetch(`${API_URL}/checkins/${solicitanteId}`);

        if (response.status === 200) {
            return (await response.json()) as CheckinHumorAnonimoTO[];
        } else if (response.status === 403) {
            throw new Error("Acesso negado. Apenas o RH pode visualizar o histórico de auditoria.");
        }
        return [];
    } catch (error: unknown) {
        console.error("Erro ao buscar histórico:", getErrorMessage(error));
        if (error instanceof Error && error.message.includes("Acesso negado")) throw error;
        return [];
    }
}

// RECURSOS DE REFERÊNCIA

export async function buscarEquipes(): Promise<EquipeTO[]> {
    try {
        const response = await fetch(`${API_URL}/equipes`);
        if (response.status === 200) {
            return (await response.json()) as EquipeTO[];
        }
        return [];
    } catch (error: unknown) {
        console.error("Erro ao buscar equipes:", getErrorMessage(error));
        return [];
    }
}

export async function buscarFuncoes(): Promise<FuncaoTO[]> {
    try {
        const response = await fetch(`${API_URL}/funcoes`);
        if (response.status === 200) {
            return (await response.json()) as FuncaoTO[];
        }
        return [];
    } catch (error: unknown) {
        console.error("Erro ao buscar funções:", getErrorMessage(error));
        return [];
    }
}

// RECURSOS DE BEM-ESTAR

export async function buscarRecursos(): Promise<RecursoBemEstarTO[]> {
    try {
        const response = await fetch(`${API_URL}/recursos`);
        if (response.status === 200) {
            return (await response.json()) as RecursoBemEstarTO[];
        }
        return [];
    } catch (error: unknown) {
        console.error("Erro ao buscar recursos:", getErrorMessage(error));
        return [];
    }
}

export async function listarRecursosFavoritos(idFunc: number): Promise<RecursoBemEstarTO[]> {
    try {
        const response = await fetch(`${API_URL}/funcionarios/${idFunc}/recursos`);
        if (response.status === 200) {
            return (await response.json()) as RecursoBemEstarTO[];
        }
        return [];
    } catch (error: unknown) {
        console.error("Erro ao listar favoritos:", getErrorMessage(error));
        return [];
    }
}

export async function adicionarRecursoFavorito(idFunc: number, idRecurso: number): Promise<boolean> {
    try {
        const response = await fetch(`${API_URL}/funcionarios/${idFunc}/recursos/${idRecurso}`, {
            method: 'POST',
            headers: JSON_HEADERS,
        });
        return response.status === 201;
    } catch (error: unknown) {
        console.error("Erro ao adicionar favorito:", getErrorMessage(error));
        return false;
    }
}

export async function removerRecursoFavorito(idFunc: number, idRecurso: number): Promise<boolean> {
    try {
        const response = await fetch(`${API_URL}/funcionarios/${idFunc}/recursos/${idRecurso}`, {
            method: 'DELETE',
        });
        return response.status === 204;
    } catch (error: unknown) {
        console.error("Erro ao remover favorito:", getErrorMessage(error));
        return false;
    }
}

// GESTÃO DE FUNCIONÁRIOS (RH)

export async function listarTodosFuncionarios(): Promise<FuncionarioTO[]> {
    try {
        const response = await fetch(`${API_URL}/funcionarios`);
        if (response.status === 200) {
            return (await response.json()) as FuncionarioTO[];
        }
        return [];
    } catch (error: unknown) {
        console.error("Erro ao listar funcionários:", getErrorMessage(error));
        return [];
    }
}

export async function excluirFuncionario(id: number): Promise<boolean> {
    try {
        const response = await fetch(`${API_URL}/funcionarios/${id}`, {
            method: 'DELETE',
        });
        return response.status === 204; // No Content = Sucesso
    } catch (error: unknown) {
        console.error("Erro ao excluir funcionário:", getErrorMessage(error));
        return false;
    }
}

export async function atualizarFuncionario(id: number, dados: FuncionarioTO): Promise<boolean> {
    try {
        const response = await fetch(`${API_URL}/funcionarios/${id}`, {
            method: 'PUT',
            headers: JSON_HEADERS,
            body: JSON.stringify(dados),
        });
        return response.status === 200;
    } catch (error: unknown) {
        console.error("Erro ao atualizar funcionário:", getErrorMessage(error));
        return false;
    }
}

// GESTÃO DE RECURSOS (RH)

export async function criarRecurso(recurso: RecursoBemEstarTO): Promise<boolean> {
    try {
        const response = await fetch(`${API_URL}/recursos`, {
            method: 'POST',
            headers: JSON_HEADERS,
            body: JSON.stringify(recurso),
        });
        return response.status === 201;
    } catch (error: unknown) {
        console.error("Erro ao criar recurso:", getErrorMessage(error));
        return false;
    }
}

export async function excluirRecurso(id: number): Promise<boolean> {
    try {
        const response = await fetch(`${API_URL}/recursos/${id}`, {
            method: 'DELETE',
        });
        return response.status === 204;
    } catch (error: unknown) {
        console.error("Erro ao excluir recurso:", getErrorMessage(error));
        return false;
    }
}

export async function atualizarRecurso(id: number, recurso: RecursoBemEstarTO): Promise<boolean> {
    try {
        const response = await fetch(`${API_URL}/recursos/${id}`, {
            method: 'PUT',
            headers: JSON_HEADERS,
            body: JSON.stringify(recurso),
        });
        return response.status === 200;
    } catch (error: unknown) {
        console.error("Erro ao atualizar recurso:", getErrorMessage(error));
        return false;
    }
}
