









import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaBrain,
    FaSmile,
    FaMeh,
    FaFrown,
    FaHeartbeat
} from "react-icons/fa";

// Serviços e Tipos
import { buscarRelatorioDashboard } from "../../services/apiService";
import type { FuncionarioTO, RelatorioHumorTO } from "../../types/api";

// Constantes
import { ID_FUNCAO_RH, PERFIS_DASHBOARD } from "../../types/constants";


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

const getIndicadores = (media: number) => {
    if (media >= 4.0) return {
        type: "status-high",
        icon: <FaSmile />,
        label: "Alta Performance",
        desc: "Equipe com excelentes índices de vitalidade e engajamento."
    };
    if (media >= 3.0) return {
        type: "status-mid",
        icon: <FaMeh />,
        label: "Zona de Observação",
        desc: "Indicadores estáveis, mas requerem monitoramento preventivo."
    };
    return {
        type: "status-low",
        icon: <FaFrown />,
        label: "Atenção Crítica",
        desc: "Sinais de sobrecarga identificados. Ação corretiva recomendada."
    };
};

export default function Dashboard() {
    const navigate = useNavigate();

    const [relatorios, setRelatorios] = useState<RelatorioHumorTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [apiError, setApiError] = useState<string | null>(null);

    const funcionario = getSessionFuncionario();
    const isAuthorized = funcionario && PERFIS_DASHBOARD.includes(funcionario.idFuncao);

    useEffect(() => {
        if (!funcionario) {
            navigate("/login");
            return;
        }

        if (!isAuthorized) {
            alert("Acesso restrito. Redirecionando...");
            navigate("/checkin");
            return;
        }

        let isMounted = true;

        async function loadDashboardData() {
            setIsLoading(true);
            setApiError(null);

            try {
                const data = await buscarRelatorioDashboard(funcionario!.id);

                if (isMounted) {
                    if (data.length > 0) {
                        setRelatorios(data);
                    } else {
                        setApiError("Não há dados suficientes para gerar os indicadores no momento.");
                    }
                }
            } catch (error: unknown) {
                if (isMounted) {
                    const msg = error instanceof Error ? error.message : "Erro de conexão.";
                    setApiError(msg);
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        loadDashboardData();
        return () => { isMounted = false; };

    }, [funcionario?.id, isAuthorized, navigate]);

    if (!funcionario) return null;

    if (isLoading) {
        return (
            <main className="loading-state">
                <div className="spinner"></div>
                <p>Processando métricas...</p>
            </main>
        );
    }

    const dashboardTitle = funcionario.idFuncao === ID_FUNCAO_RH
        ? "Painel de Gestão de Pessoas"
        : `Indicadores da Equipe ${funcionario.equipeId}`;

    return (
        <main className="dashboard-page">
            <div className="content-wrapper">

                <header className="page-header">
                    <div className="header-content">
                        <h6>Dashboard Analítico</h6>
                        <h1>{dashboardTitle}</h1>
                        <p>Acompanhamento em tempo real do clima organizacional e saúde mental.</p>
                    </div>

                    {funcionario.idFuncao === ID_FUNCAO_RH && (
                        <button
                            onClick={() => navigate("/admin/auditoria")}
                            className="btn-action"
                        >
                            <FaBrain className="text-base" />
                            <span>Acessar Inteligência</span>
                        </button>
                    )}
                </header>

                {apiError && !relatorios.length ? (
                    <div className="empty-state">
                        <p>{apiError}</p>
                    </div>
                ) : (
                    <div className="metrics-grid">
                        {relatorios.map((relatorio) => {
                            const { mediaNivelHumor, nomeEquipe, totalCheckins } = relatorio;
                            const status = getIndicadores(mediaNivelHumor);

                            return (
                                <div key={relatorio.equipeId} className={`metric-card ${status.type}`}>

                                    <div className="card-header">
                                        <div className="title-group">
                                            <h2 title={nomeEquipe}>{nomeEquipe}</h2>
                                            <span className="badge">{status.label}</span>
                                        </div>
                                        <div className="icon-wrapper">
                                            {status.icon}
                                        </div>
                                    </div>

                                    <div className="card-body">
                                        <div>
                                            <p className="description" title={status.desc}>
                                                {status.desc}
                                            </p>

                                            <div className="score-section">
                                                <div className="score-header">
                                                    <span className="label">Bem-Estar</span>
                                                    <div className="value-group">
                                                        <span className="value">{mediaNivelHumor.toFixed(1)}</span>
                                                        <span className="scale">/ 5.0</span>
                                                    </div>
                                                </div>

                                                <div className="progress-track">
                                                    <div
                                                        className="progress-fill"
                                                        style={{ width: `${(mediaNivelHumor / 5) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card-footer">
                                            <div className="stat-icon">
                                                <FaHeartbeat />
                                                <span>Índice Geral</span>
                                            </div>
                                            <span>{totalCheckins} resp.</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}
