import { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FaUserPlus, FaSignInAlt } from "react-icons/fa";

// Serviços e Tipos
import { cadastrarFuncionario, buscarEquipes, buscarFuncoes } from "../../services/apiService";
import type { CadastroFormData } from "../../types/forms";
import type { FuncionarioTO, EquipeTO, FuncaoTO } from "../../types/api";

// Regras de Negócio
import { ID_FUNCAO_RH } from "../../types/constants";

// Recuperar Sessão
const getSessionFuncionario = (): FuncionarioTO | null => {
    const storedData = localStorage.getItem('session_funcionario');
    if (storedData) {
        try {
            return JSON.parse(storedData) as FuncionarioTO;
        } catch (e) {
            return null;
        }
    }
    return null;
};

export default function Cadastro() {
    const navigate = useNavigate();

    // Estados
    const [apiError, setApiError] = useState<string | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Dados
    const [equipes, setEquipes] = useState<EquipeTO[]>([]);
    const [funcoes, setFuncoes] = useState<FuncaoTO[]>([]);

    const solicitante = getSessionFuncionario();

    useEffect(() => {
        if (!solicitante || solicitante.idFuncao !== ID_FUNCAO_RH) {
            alert("Acesso negado. Apenas o RH pode cadastrar novos funcionários.");
            navigate("/dashboard");
            return;
        }

        let isMounted = true;

        async function loadReferenceData() {
            setIsDataLoading(true);
            setLoadError(null);
            try {
                const [listaEquipes, listaFuncoes] = await Promise.all([
                    buscarEquipes(),
                    buscarFuncoes()
                ]);

                if (isMounted) {
                    setEquipes(listaEquipes);
                    setFuncoes(listaFuncoes);
                    if (listaEquipes.length === 0 || listaFuncoes.length === 0) {
                        setLoadError("Aviso: As listas de Equipes ou Funções estão vazias.");
                    }
                }
            } catch (error: unknown) {
                if (isMounted) {
                    const msg = error instanceof Error ? error.message : "Erro desconhecido.";
                    setLoadError(`Falha crítica ao carregar dados: ${msg}`);
                }
            } finally {
                if (isMounted) setIsDataLoading(false);
            }
        }
        loadReferenceData();
        return () => { isMounted = false; };
    }, [solicitante?.idFuncao, navigate]);

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<CadastroFormData>({
        defaultValues: {
            nome: "", email: "", senha: "",
            dataContratacao: new Date().toISOString().split('T')[0],
            equipeId: 0, idFuncao: 0,
        }
    });

    const handleCadastro: SubmitHandler<CadastroFormData> = async (data) => {
        if (!solicitante) return;
        setApiError(null);
        setSuccessMessage(null);

        try {
            const payload: FuncionarioTO = { ...data, id: 0 } as FuncionarioTO;
            const { user, error } = await cadastrarFuncionario(payload, solicitante.id);

            if (user) {
                setSuccessMessage(`Funcionário "${user.nome}" cadastrado com sucesso! Redirecionando...`);
                reset();
                window.scrollTo(0, 0);
                setTimeout(() => navigate("/admin/funcionarios"), 2000);
            } else if (error) {
                setApiError(error);
                window.scrollTo(0, 0);
            }
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "Erro desconhecido.";
            setApiError(`Ocorreu um erro inesperado: ${msg}`);
            window.scrollTo(0, 0);
        }
    };

    if (isDataLoading) {
        return (
            <main className="page-feedback">
                <div className="loading-content">
                    <div className="spinner"></div>
                    <p>Carregando dados de referência...</p>
                </div>
            </main>
        );
    }

    if (loadError) {
        return (
            <main className="page-feedback">
                <div className="error-content">
                    <div className="alert-box" role="alert">
                        <strong>Erro Crítico de Configuração: </strong>
                        <span>{loadError}</span>
                    </div>
                    <button onClick={() => window.location.reload()} className="btn-retry">
                        Tentar Novamente
                    </button>
                </div>
            </main>
        );
    }

    // Formulário Principal
    return (
        <main className="cadastro-container">
            <div className="cadastro-card">
                <header className="card-header">
                    <h1><FaUserPlus /> Cadastro de Novo Funcionário</h1>
                    <p className="subtitle">Área restrita ao RH. Preencha os dados para criar um novo acesso.</p>
                </header>

                <div className="feedback-area">
                    {apiError && (
                        <div className="msg-box error">
                            <p className="label">Falha:</p>
                            <p>{apiError}</p>
                        </div>
                    )}
                    {successMessage && (
                        <div className="msg-box success">
                            <p className="label">Sucesso:</p>
                            <p>{successMessage}</p>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit(handleCadastro)} className="form-content" noValidate>
                    <div className="input-group">
                        <label htmlFor="nome">Nome Completo</label>
                        <input
                            id="nome" type="text" placeholder="Ex: Ana Silva"
                            disabled={isSubmitting}
                            className={`input-field ${errors.nome ? 'has-error' : ''}`}
                            {...register("nome", { required: "O nome é obrigatório.", maxLength: { value: 100, message: "Máximo de 100 caracteres." } })}
                        />
                        {errors.nome && <span className="error-text">{errors.nome.message}</span>}
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">E-mail Corporativo</label>
                        <input
                            id="email" type="email" placeholder="ana.silva@empresa.com"
                            disabled={isSubmitting}
                            className={`input-field ${errors.email ? 'has-error' : ''}`}
                            {...register("email", {
                                required: "O e-mail é obrigatório.",
                                pattern: { value: /^\S+@\S+$/i, message: "Insira um e-mail válido." }
                            })}
                        />
                        {errors.email && <span className="error-text">{errors.email.message}</span>}
                    </div>

                    <div className="form-row">
                        <div className="input-group">
                            <label htmlFor="senha">Senha Inicial</label>
                            <input
                                id="senha" type="password" placeholder="••••••"
                                disabled={isSubmitting}
                                className={`input-field ${errors.senha ? 'has-error' : ''}`}
                                {...register("senha", {
                                    required: "A senha inicial é obrigatória.",
                                    minLength: { value: 6, message: "Mínimo 6 caracteres." }
                                })}
                            />
                            {errors.senha && <span className="error-text">{errors.senha.message}</span>}
                        </div>

                        <div className="input-group">
                            <label htmlFor="dataContratacao">Data de Contratação</label>
                            <input
                                id="dataContratacao" type="date"
                                disabled={isSubmitting}
                                className={`input-field ${errors.dataContratacao ? 'has-error' : ''}`}
                                {...register("dataContratacao", { required: "A data é obrigatória." })}
                            />
                            {errors.dataContratacao && <span className="error-text">{errors.dataContratacao.message}</span>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="input-group">
                            <label htmlFor="idFuncao">Função / Cargo</label>
                            <select
                                id="idFuncao"
                                disabled={isSubmitting}
                                className={`input-field ${errors.idFuncao ? 'has-error' : ''}`}
                                {...register("idFuncao", {
                                    required: "Selecione uma função.",
                                    valueAsNumber: true,
                                    validate: (value) => value > 0 || "Selecione uma opção válida."
                                })}
                            >
                                <option value="0">Selecione...</option>
                                {funcoes.map((f) => (
                                    <option key={f.id} value={f.id}>{f.nome}</option>
                                ))}
                            </select>
                            {errors.idFuncao && <span className="error-text">{errors.idFuncao.message}</span>}
                        </div>

                        <div className="input-group">
                            <label htmlFor="equipeId">Equipe (Squad)</label>
                            <select
                                id="equipeId"
                                disabled={isSubmitting}
                                className={`input-field ${errors.equipeId ? 'has-error' : ''}`}
                                {...register("equipeId", {
                                    required: "Selecione uma equipe.",
                                    valueAsNumber: true,
                                    validate: (value) => value > 0 || "Selecione uma opção válida."
                                })}
                            >
                                <option value="0">Selecione...</option>
                                {equipes.map((e) => (
                                    <option key={e.id} value={e.id}>{e.nome} [{e.sigla}]</option>
                                ))}
                            </select>
                            {errors.equipeId && <span className="error-text">{errors.equipeId.message}</span>}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`btn-submit ${isSubmitting ? "is-loading" : ""}`}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="spinner-sm"></div> Processando...
                                </>
                            ) : (
                                <>
                                    <FaSignInAlt /> Cadastrar Funcionário
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}