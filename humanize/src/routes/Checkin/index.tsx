import { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";

// Serviços e Tipos
import { registrarCheckin } from "../../services/apiService";
import type { CheckinFormData } from "../../types/forms";
import type { CheckinHumorTO, FuncionarioTO } from "../../types/api";

// Constantes
import {
    OPCOES_VOLUME,
    OPCOES_SONO,
    OPCOES_INTERACAO,
    OPCOES_DESCONEXAO
} from "../../types/constants";

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

const getLocalDateString = (): string => {
    const date = new Date();
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
};

export default function Checkin() {
    const navigate = useNavigate();

    // Estados de Feedback
    const [apiError, setApiError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Recupera dados do usuário logado
    const funcionario = getSessionFuncionario();
    const funcionarioId = funcionario?.id;

    useEffect(() => {
        if (!funcionarioId) {
            navigate("/login");
        }
    }, [funcionarioId, navigate]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CheckinFormData>({
        defaultValues: {
            nivelEnergia: 3,
            sentimento: "",
            volumeDemandas: "Equilibrada",
            bloqueios: "",
            desconexao: "Sim",
            nivelConexao: 3,
            qualidadeInteracao: "Sim",
            qualidadeSono: "Dormi bem",
            statusPausas: "Sim",
            pequenoGanho: "",
        }
    });

    const onSubmit: SubmitHandler<CheckinFormData> = async (data) => {
        if (!funcionarioId) return;

        setIsLoading(true);
        setApiError(null);
        setSuccessMessage(null);

        try {
            const payload: CheckinHumorTO = {
                ...data,
                id: 0,
                funcionarioId: funcionarioId,
                dataCheckin: getLocalDateString(),
                bloqueios: data.bloqueios?.trim() || null,
                pequenoGanho: data.pequenoGanho?.trim() || null,
                nivelEnergia: data.nivelEnergia,
                nivelConexao: data.nivelConexao
            };

            const { success, error } = await registrarCheckin(payload);

            if (success) {
                setSuccessMessage("Check-in registrado com sucesso! Obrigado por compartilhar seu dia.");
                reset();
                window.scrollTo(0, 0);
            } else {
                setApiError(error || "Erro ao registrar. Verifique se você já não fez o check-in hoje.");
                window.scrollTo(0, 0);
            }
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "Erro desconhecido.";
            setApiError(`Falha na conexão com o servidor: ${msg}`);
            window.scrollTo(0, 0);
        } finally {
            setIsLoading(false);
        }
    };

    if (!funcionarioId) return null;

    return (
        <main className="checkin-page">
            <div className="checkin-card">

                <header className="header-section">
                    <h1>Check-in Diário</h1>
                    <p>
                        Olá, <span className="highlight">{funcionario?.nome.split(' ')[0]}</span>!
                        Como você está se sentindo hoje?
                    </p>
                </header>

                {apiError && (
                    <div className="alert-box error" role="alert">
                        <p>{apiError}</p>
                    </div>
                )}
                {successMessage && (
                    <div className="alert-box success" role="status">
                        <p>{successMessage}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="checkin-form" noValidate>

                    <fieldset className="form-section">
                        <legend>1. Energia e Humor</legend>

                        <div className="input-group">
                            <label htmlFor="nivelEnergia">
                                Nível de Energia (1 = Exausto, 5 = Energizado)
                            </label>

                            <div className="range-labels-desc">
                                <span>Baixa</span>
                                <span>Alta</span>
                            </div>

                            <div className="range-container">
                                <input
                                    id="nivelEnergia"
                                    type="range"
                                    min="1" max="5" step="1"
                                    className="form-range"
                                    {...register("nivelEnergia", { valueAsNumber: true, required: "Informe seu nível de energia" })}
                                    disabled={isLoading}
                                />
                                <div className="range-steps">
                                    <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
                                </div>
                            </div>

                            {errors.nivelEnergia && <span className="error-msg">{errors.nivelEnergia.message}</span>}
                        </div>

                        <div className="input-group">
                            <label htmlFor="sentimento">
                                Defina seu sentimento atual em uma palavra:
                            </label>
                            <input
                                id="sentimento"
                                type="text"
                                placeholder="Ex: Focado, Ansioso, Grato..."
                                className="form-control"
                                {...register("sentimento", { required: "O sentimento é obrigatório.", maxLength: { value: 50, message: "Máximo de 50 caracteres." } })}
                                disabled={isLoading}
                            />
                            {errors.sentimento && <span className="error-msg">{errors.sentimento.message}</span>}
                        </div>
                    </fieldset>

                    <fieldset className="form-section">
                        <legend>2. Carga de Trabalho</legend>

                        <div className="input-group">
                            <label htmlFor="volumeDemandas">Volume de demandas hoje:</label>
                            <select
                                id="volumeDemandas"
                                className="select-tipo-recursos"
                                {...register("volumeDemandas", { required: true })}
                                disabled={isLoading}
                            >
                                {OPCOES_VOLUME.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group">
                            <label htmlFor="bloqueios">Algum bloqueio ou preocupação específica? (Opcional)</label>
                            <textarea
                                id="bloqueios"
                                rows={2}
                                className="form-control"
                                placeholder="Ex: Prazo apertado no projeto X..."
                                {...register("bloqueios", { maxLength: { value: 250, message: "Limite de 250 caracteres excedido." } })}
                                disabled={isLoading}
                            />
                            {errors.bloqueios && <span className="error-msg">{errors.bloqueios.message}</span>}
                        </div>

                        <div className="input-group">
                            <label className="mb-3 block text-gray-700 font-medium">
                                Sente que conseguirá se desconectar após o expediente?
                            </label>
                            <div className="radio-group">
                                {OPCOES_DESCONEXAO.map((opt) => (
                                    <label key={opt} className="radio-label">
                                        <input
                                            type="radio"
                                            value={opt}
                                            {...register("desconexao", { required: "Selecione uma opção" })}
                                            disabled={isLoading}
                                        />
                                        {opt}
                                    </label>
                                ))}
                            </div>
                            {errors.desconexao && <span className="error-msg">{errors.desconexao.message}</span>}
                        </div>
                    </fieldset>

                    <fieldset className="form-section">
                        <legend>3. Conexão e Ambiente</legend>

                        <div className="input-group">
                            <label htmlFor="nivelConexao">
                                Nível de conexão com a equipe (1 = Isolado, 5 = Conectado):
                            </label>

                            <div className="range-labels-desc">
                                <span>Isolado</span>
                                <span>Conectado</span>
                            </div>

                            <div className="range-container">
                                <input
                                    id="nivelConexao"
                                    type="range"
                                    min="1" max="5" step="1"
                                    className="form-range"
                                    {...register("nivelConexao", { valueAsNumber: true, required: true })}
                                    disabled={isLoading}
                                />
                                <div className="range-steps">
                                    <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid-row">
                            <div className="input-group">
                                <label htmlFor="qualidadeInteracao">Teve espaço para ideias?</label>
                                <select
                                    id="qualidadeInteracao"
                                    className="select-tipo-recursos"
                                    {...register("qualidadeInteracao", { required: true })}
                                    disabled={isLoading}
                                >
                                    {OPCOES_INTERACAO.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-group">
                                <label htmlFor="qualidadeSono">Qualidade do sono:</label>
                                <select
                                    id="qualidadeSono"
                                    className="select-tipo-recursos"
                                    {...register("qualidadeSono", { required: true })}
                                    disabled={isLoading}
                                >
                                    {OPCOES_SONO.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-group md:col-span-2">
                                <label htmlFor="statusPausas">Conseguiu fazer pausas?</label>
                                <select
                                    id="statusPausas"
                                    className="select-tipo-recursos"
                                    {...register("statusPausas", { required: true })}
                                    disabled={isLoading}
                                >
                                    <option value="Sim">Sim</option>
                                    <option value="Não, não tive tempo">Não, não tive tempo</option>
                                </select>
                            </div>
                        </div>
                    </fieldset>

                    <fieldset className="form-section border-none pb-0">
                        <legend>4. Pequeno Ganho</legend>
                        <div className="input-group">
                            <label htmlFor="pequenoGanho">
                                Algo positivo ou uma pequena vitória de hoje? (Opcional)
                            </label>
                            <textarea
                                id="pequenoGanho"
                                rows={2}
                                className="form-control"
                                placeholder="Ex: Finalizei o relatório, ajudei um colega..."
                                {...register("pequenoGanho", { maxLength: { value: 250, message: "Limite de 250 caracteres excedido." } })}
                                disabled={isLoading}
                            />
                            {errors.pequenoGanho && <span className="error-msg">{errors.pequenoGanho.message}</span>}
                        </div>
                    </fieldset>

                    <div className="actions-row">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`btn-submit ${isLoading ? "is-loading" : ""}`}
                        >
                            {isLoading ? "Enviando..." : "Registrar Check-in"}
                        </button>
                    </div>

                </form>
            </div>
        </main>
    );
}
