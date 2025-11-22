import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserPlus, FaUsersCog } from "react-icons/fa";

// Serviços e Tipos
import {
    listarTodosFuncionarios, excluirFuncionario, atualizarFuncionario,
    buscarEquipes, buscarFuncoes
} from "../../services/apiService";
import type { FuncionarioTO, EquipeTO, FuncaoTO } from "../../types/api";
import { ID_FUNCAO_RH } from "../../types/constants";
import ListaFuncionarios from "../../components/ListaFuncionarios/ListaFuncionarios";
import ModalEditarFuncionario from "../../components/ModalEditarFuncionario/ModalEditarFuncionario";

// Helper de Sessão
const getSessionFuncionario = (): FuncionarioTO | null => {
    const storedData = localStorage.getItem('session_funcionario');
    return storedData ? JSON.parse(storedData) : null;
};

export default function AdminFuncionarios() {
    const navigate = useNavigate();
    const solicitante = getSessionFuncionario();

    // Estados de Dados
    const [funcionarios, setFuncionarios] = useState<FuncionarioTO[]>([]);
    const [equipes, setEquipes] = useState<EquipeTO[]>([]);
    const [funcoes, setFuncoes] = useState<FuncaoTO[]>([]);

    // Estados de Controle
    const [editingUser, setEditingUser] = useState<FuncionarioTO | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Estados de Feedback
    const [apiError, setApiError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Efeito para Autorização e Carregamento Inicial
    useEffect(() => {
        // Regra de Autorização: Apenas RH (ID_FUNCAO_RH = 5) tem acesso 
        if (!solicitante || solicitante.idFuncao !== ID_FUNCAO_RH) {
            alert("Acesso restrito ao RH.");
            navigate("/dashboard");
            return;
        }
        loadData();
    }, [navigate, solicitante?.idFuncao]);

    async function loadData() {
        setIsLoading(true);
        setApiError(null);
        try {
            const [listaFunc, listaEquipes, listaFuncoes] = await Promise.all([
                listarTodosFuncionarios(), buscarEquipes(), buscarFuncoes()
            ]);
            setFuncionarios(listaFunc);
            setEquipes(listaEquipes);
            setFuncoes(listaFuncoes);
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "Erro desconhecido ao carregar dados.";
            setApiError(msg);
        } finally {
            setIsLoading(false);
        }
    }

    const handleSelectForEdit = (func: FuncionarioTO) => {
        setEditingUser(func);
        setApiError(null);
        setSuccessMessage(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
        setApiError(null);
        setSuccessMessage(null);
    };

    // Salvar Edição (PUT)
    const handleUpdateSubmit = async (data: FuncionarioTO) => {
        if (!editingUser) return;
        setApiError(null);
        setSuccessMessage(null);

        try {
            const dadosAtualizados = {
                ...data,
                id: editingUser.id,
                equipeId: Number(data.equipeId),
                idFuncao: Number(data.idFuncao)
            };

            const sucesso = await atualizarFuncionario(editingUser.id, dadosAtualizados);

            if (sucesso) {
                setSuccessMessage(`Funcionário "${data.nome}" atualizado com sucesso!`);
                setEditingUser(null);
                loadData(); // Recarrega a lista para mostrar a alteração
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                setApiError("Erro ao atualizar. Verifique se o e-mail não está duplicado.");
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "Erro desconhecido.";
            setApiError(`Falha: ${msg}`);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Excluir (DELETE) 
    const handleDelete = async (id: number, nome: string) => {
        if (window.confirm(`Tem certeza que deseja excluir o funcionário ${nome}? Esta ação é irreversível e removerá todos os check-ins e favoritos associados.`)) {
            setApiError(null);
            setSuccessMessage(null);
            try {
                const sucesso = await excluirFuncionario(id);
                if (sucesso) {
                    setFuncionarios(prev => prev.filter(f => f.id !== id));
                    setSuccessMessage(`Funcionário "${nome}" excluído com sucesso.`);

                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    setApiError("Erro ao excluir. Tente novamente.");
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            } catch (error: unknown) {
                const msg = error instanceof Error ? error.message : "Erro desconhecido.";
                setApiError(`Erro ao excluir: ${msg}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    };

    return (
        <main className="main-admin-funcionario">
            <div className="admin-funcionario">

                <header className="admin-funcionario-dois">
                    <div>
                        <h1 className="texto-gestao-colaboradores">
                            <FaUsersCog className="icone-gestao" /> Gestão de Colaboradores
                        </h1>
                        <p className="texto-gerencia-acesso">Gerencie acessos, perfis e dados cadastrais.</p>
                    </div>

                    <button
                        onClick={() => navigate("/cadastro")}
                        className="btn-novo-cadastro"
                        title="Ir para tela de cadastro de novo funcionário"
                    >
                        <FaUserPlus /> Novo Cadastro
                    </button>
                </header>

                <div className="mensagem-gestao">
                    {apiError && (
                        <div className="mensagem-erro-gestao" role="alert">
                            <p className="font-bold">Atenção:</p>
                            <p>{apiError}</p>
                        </div>
                    )}
                    {successMessage && (
                        <div className="mensagem-sucesso-gestao" role="status">
                            <p className="font-bold">Sucesso:</p>
                            <p>{successMessage}</p>
                        </div>
                    )}
                </div>

                {editingUser && (
                    <ModalEditarFuncionario
                        funcionario={editingUser}
                        equipes={equipes}
                        funcoes={funcoes}
                        onCancel={handleCancelEdit}
                        onSave={handleUpdateSubmit}
                    />
                )}

                <ListaFuncionarios
                    funcionarios={funcionarios}
                    funcoes={funcoes}
                    isLoading={isLoading}
                    editingId={editingUser?.id}
                    onEdit={handleSelectForEdit}
                    onDelete={handleDelete}
                />
            </div>
        </main>
    );
}