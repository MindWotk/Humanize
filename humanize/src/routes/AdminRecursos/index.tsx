import { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaLink, FaEdit, FaTimes, FaPlus, FaSave, FaBookOpen } from "react-icons/fa";

// Serviços
import {
    buscarRecursos,
    criarRecurso,
    excluirRecurso,
    atualizarRecurso
} from "../../services/apiService";

// Tipos e Constantes
import type { RecursoBemEstarTO, FuncionarioTO } from "../../types/api";
import { ID_FUNCAO_RH } from "../../types/constants";

const getSessionFuncionario = (): FuncionarioTO | null => {
    const storedData = localStorage.getItem('session_funcionario');
    return storedData ? JSON.parse(storedData) : null;
};

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return String(error);
}

export default function AdminRecursos() {
    const navigate = useNavigate();
    const solicitante = getSessionFuncionario();

    // Estados de Dados
    const [recursos, setRecursos] = useState<RecursoBemEstarTO[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);

    // Estados de Feedback
    const [apiError, setApiError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm<RecursoBemEstarTO>();

    // Proteção de Rota e Carregamento Inicial
    useEffect(() => {
        if (!solicitante || solicitante.idFuncao !== ID_FUNCAO_RH) {
            alert("Acesso restrito ao RH.");
            navigate("/dashboard");
            return;
        }
        loadRecursos();
    }, [navigate, solicitante?.idFuncao]);

    async function loadRecursos() {
        setIsLoadingData(true);
        setApiError(null);
        try {
            const data = await buscarRecursos();
            setRecursos(data);
        } catch (error: unknown) {
            setApiError(`Falha ao carregar recursos: ${getErrorMessage(error)}`);
        } finally {
            setIsLoadingData(false);
        }
    }

    // CRUD - Submissão do Formulário (POST/PUT)
    const onSubmit: SubmitHandler<RecursoBemEstarTO> = async (data) => {
        setIsSubmitting(true);
        setApiError(null);
        setSuccessMessage(null);

        try {
            let sucesso = false;
            if (editingId) {
                // Atualização (PUT)
                const recursoAtualizado = { ...data, id: editingId };
                sucesso = await atualizarRecurso(editingId, recursoAtualizado);
            } else {
                // Criação (POST)
                const novoRecurso = { ...data, id: 0 };
                sucesso = await criarRecurso(novoRecurso);
            }

            if (sucesso) {
                setSuccessMessage(editingId ? "Recurso atualizado com sucesso!" : "Recurso adicionado com sucesso!");
                setEditingId(null);
                reset(); // Limpa o formulário após sucesso
                await loadRecursos(); // Recarrega a lista
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                setApiError("Erro ao processar solicitação. Verifique se a URL é válida ou se a conexão falhou.");
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (error: unknown) {
            setApiError(`Falha na API: ${getErrorMessage(error)}`);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // CRUD - Seleção para Edição
    const handleEdit = (recurso: RecursoBemEstarTO) => {
        setEditingId(recurso.id);
        // Preenche o formulário com os dados do recurso selecionado
        setValue("nome", recurso.nome);
        setValue("tipo", recurso.tipo);
        setValue("link", recurso.link);

        setApiError(null);
        setSuccessMessage(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // CRUD - Cancelamento da Edição
    const handleCancelEdit = () => {
        setEditingId(null);
        reset();
        setApiError(null);
        setSuccessMessage(null);
    };

    // CRUD - Exclusão (DELETE)
    const handleDelete = async (id: number) => {
        if (!window.confirm("Deseja realmente excluir este recurso? Ele será removido da biblioteca de todos os colaboradores.")) return;

        setIsSubmitting(true);
        setApiError(null);
        setSuccessMessage(null);

        try {
            const sucesso = await excluirRecurso(id);
            if (sucesso) {
                setSuccessMessage("Recurso excluído com sucesso!");
                await loadRecursos();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                setApiError("Erro ao excluir recurso. ID não encontrado ou erro de permissão.");
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (error: unknown) {
            setApiError(`Falha na exclusão: ${getErrorMessage(error)}`);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="main-admin-recursos">
            <div className="admin-recursos">

                <header>
                    <h1 className="titulo-gestao-recursos">
                        <FaBookOpen className="icone-gestao-recursos" /> Gestão de Recursos de Bem-Estar
                    </h1>
                    <p className="texto-gestao-recursos">Administre o conteúdo que apoia a saúde mental dos colaboradores.</p>
                </header>

                <div className="mensagem-erro-gestao-recursos">
                    {successMessage && (
                        <div className="mensagem-sucesso-recursos" role="status">
                            <p className="font-bold">Sucesso:</p>
                            <p>{successMessage}</p>
                        </div>
                    )}
                    {apiError && (
                        <div className="mensagem-erro-recursos" role="alert">
                            <p className="font-bold">Erro:</p>
                            <p>{apiError}</p>
                        </div>
                    )}
                </div>

                <div className={`gestao-recursos ${editingId ? 'border-yellow-500' : 'border-teal-600'}`}>

                    <div className="gestao-recursos-dois">
                        <h2 className="titulo-recursos-editando-adicionando">
                            {editingId ? <FaEdit className="icone-recursos-editar" /> : <FaPlus className="icone-recursos-adicionar" />}
                            {editingId ? `Editando Recurso #${editingId}` : "Adicionar Novo Recurso"}
                        </h2>
                        {editingId && (
                            <button onClick={handleCancelEdit} disabled={isSubmitting} className="btn-cancelar-recursos">
                                <FaTimes />
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="form-recursos-adicionar-recursos">

                        <div className="nome-texto-recursos">
                            <label className="label-nome-recursos">Nome/Título</label>
                            <input
                                {...register("nome", { required: "Nome obrigatório", maxLength: { value: 100, message: "Máximo 100 caracteres" } })}
                                disabled={isSubmitting}
                                className="input-nome-recursos"
                                placeholder="Ex: Meditação de 5 minutos"
                            />
                            {errors.nome && <span className="erro-nome-recursos">{errors.nome.message}</span>}
                        </div>

                        <div className="tipo-recursos">
                            <label className="label-tipo-recursos">Tipo</label>
                            <select
                                {...register("tipo", { required: "Tipo obrigatório" })}
                                disabled={isSubmitting}
                                className="select-tipo-recursos"
                            >
                                <option value="">Selecione...</option>
                                <option value="Vídeo">Vídeo</option>
                                <option value="Artigo">Artigo</option>
                                <option value="Áudio">Áudio</option>
                                <option value="E-book">E-book</option>
                                <option value="Serviço">Serviço</option>
                                <option value="Música">Música</option>
                                <option value="Interativo">Interativo</option>
                            </select>
                            {errors.tipo && <span className="erro-tipo-recursos">{errors.tipo.message}</span>}
                        </div>

                        <div className="link-recursos">
                            <label className="label-link-recursos">Link (URL Completa)</label>
                            <input
                                {...register("link", {
                                    required: "Link obrigatório",
                                    pattern: { value: /^(http|https):\/\/[^ "]+$/, message: "URL deve começar com http:// ou https://" }
                                })}
                                disabled={isSubmitting}
                                className="input-link-recursos"
                                placeholder="https://www.youtube.com/watch?v=..."
                            />
                            {errors.link && <span className="erro-link-recursos">{errors.link.message}</span>}
                        </div>

                        <div className="btn-salvar-alteracoes-recursos">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`btn-salvando-recursos ${isSubmitting
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : editingId
                                        ? "bg-yellow-500 hover:bg-yellow-600 shadow-yellow-300/50"
                                        : "bg-teal-600 hover:bg-teal-700 shadow-teal-300/50"
                                    }`}
                            >
                                {isSubmitting ? "Salvando..." : (editingId ? <><FaSave /> Salvar Alterações</> : <><FaPlus /> Adicionar Recurso</>)}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="gestao-recurso-dois">
                    <h3 className="h3-recursos-cadastrados">
                        Recursos Cadastrados ({recursos.length})
                    </h3>

                    {isLoadingData ? (
                        <div className="carregando-dados-admin-recursos">
                            <div className="carregando-dados-admin-recursos-dois"></div>
                            <p className="texto-carregando-dados-admin-recursos-dois">Carregando dados da biblioteca...</p>
                        </div>
                    ) : (
                        <>
                            <div className="tabela-recursos">
                                <table className="tabela-recursos-dois">
                                    <thead className="cabecalho-recursos">
                                        <tr>
                                            <th className="th-recursos-nome-tipo-link">Nome</th>
                                            <th className="th-recursos-nome-tipo-link">Tipo</th>
                                            <th className="th-recursos-nome-tipo-link">Link</th>
                                            <th className="th-recursos-acoes">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="tabela-recursos-tres">
                                        {recursos.map((rec) => (
                                            <tr key={rec.id} className={`tr-recursos-dois ${editingId === rec.id ? 'bg-yellow-50' : 'hover:bg-teal-50/30'}`}>
                                                <td className="td-recursos-nome">{rec.nome}</td>
                                                <td className="td-recursos-tipo">
                                                    <span className="td-recursos-tipo-span">
                                                        {rec.tipo}
                                                    </span>
                                                </td>
                                                <td className="td-recursos-link">
                                                    <a href={rec.link} target="_blank" rel="noreferrer" className="a-acessar-link">
                                                        <FaLink className="icone-recursos-acessar" />
                                                        Acessar
                                                    </a>
                                                </td>
                                                <td className="td-recursos-botoes-editar-excluir">
                                                    <div className="div-botoes-editar-excluir-recursos">
                                                        <button
                                                            onClick={() => handleEdit(rec)}
                                                            disabled={isSubmitting}
                                                            className="btn-recursos-editar-dois"
                                                            title="Editar Recurso"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(rec.id)}
                                                            disabled={isSubmitting}
                                                            className="btn-recursos-excluir-dois"
                                                            title="Excluir Recurso"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {recursos.length === 0 && (
                                <div className="nenhum-recurso-dois">
                                    <FaBookOpen className="icone-nenhum-recurso" />
                                    <p className="texto-nenhum-recurso">Nenhum recurso cadastrado na biblioteca.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}