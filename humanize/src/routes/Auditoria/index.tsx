





import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaExclamationTriangle, FaBrain, FaRegComments, FaTimes,
    FaFilter, FaBatteryQuarter, FaBed, FaBriefcase,
    FaChartPie, FaArrowRight, FaCheckCircle
} from "react-icons/fa";
import { buscarHistoricoAnonimo, buscarRelatorioDashboard } from "../../services/apiService";
import type { FuncionarioTO, CheckinHumorAnonimoTO, RelatorioHumorTO } from "../../types/api";
import { ID_FUNCAO_RH } from "../../types/constants";

const getSessionFuncionario = (): FuncionarioTO | null => {
    const storedData = localStorage.getItem('session_funcionario');
    if (storedData) {
        try { return JSON.parse(storedData) as FuncionarioTO; }
        catch (e) { console.error("Erro ao ler sessão:", e); return null; }
    }
    return null;
};

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return String(error);
}

export default function Auditoria() {
    const navigate = useNavigate();
    const rhUser = getSessionFuncionario();
    const [historico, setHistorico] = useState<CheckinHumorAnonimoTO[]>([]);
    const [equipesRisco, setEquipesRisco] = useState<RelatorioHumorTO[]>([]);
    const [filtroRisco, setFiltroRisco] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!rhUser || rhUser.idFuncao !== ID_FUNCAO_RH) {
            alert("Acesso restrito. Apenas profissionais de RH podem acessar a auditoria.");
            navigate("/dashboard");
            return;
        }
        let isMounted = true;
        async function loadIntelligence() {
            setIsLoading(true);
            setError(null);
            try {
                const [dadosBrutos, dadosEquipes] = await Promise.all([
                    buscarHistoricoAnonimo(rhUser!.id),
                    buscarRelatorioDashboard(rhUser!.id)
                ]);
                if (isMounted) {
                    setHistorico(dadosBrutos);
                    setEquipesRisco(dadosEquipes.filter(e => e.mediaNivelHumor < 3.0));
                }
            } catch (err) {
                if (isMounted) setError(`Não foi possível carregar a inteligência de dados: ${getErrorMessage(err)}`);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }
        loadIntelligence();
        return () => { isMounted = false; };
    }, [navigate, rhUser?.id, rhUser?.idFuncao]);

    const checkinsFiltrados = historico.filter(c => {
        if (!filtroRisco) return true;
        return c.nivelEnergia <= 2 || c.volumeDemandas === "Excessiva" || c.qualidadeSono === "Dormi mal";
    });

    if (isLoading) {
        return (
            <main className="page-loading">
                <div className="spinner"></div>
                <p>Processando inteligência de dados...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="page-error">
                <div className="error-card">
                    <div className="icon-wrapper">
                        <FaExclamationTriangle className="text-3xl" />
                    </div>
                    <h3>Erro de Conexão</h3>
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()} className="btn-reload">
                        Recarregar Página
                    </button>
                </div>
            </main>
        );
    }

    const countDemanda = historico.filter(c => c.volumeDemandas === "Excessiva").length;
    const countSono = historico.filter(c => c.qualidadeSono === "Dormi mal").length;
    const countEnergia = historico.filter(c => c.nivelEnergia <= 2).length;

    return (
        <main className="auditoria-container">
            <div className="content-wrapper">

                {/* Header */}
                <header className="header-card">
                    <div className="title-section">
                        <div className="icon-box"><FaBrain size={24} /></div>
                        <div>
                            <h1>Auditoria de Bem-Estar</h1>
                            <p>Monitoramento de riscos e análise psicossocial</p>
                        </div>
                    </div>
                    <div className="stats-section">
                        <div className="stat-box hidden md:block">
                            <p className="label">Última Atualização</p>
                            <p className="value-text">Agora mesmo</p>
                        </div>
                        <div className="divider"></div>
                        <div className="stat-box">
                            <p className="label">Total Registros</p>
                            <p className="value-number">{historico.length}</p>
                        </div>
                    </div>
                </header>

                <div className="main-grid">

                    <div className="left-column">
                        <h2><FaChartPie className="text-teal-500" /> Indicadores de Alerta</h2>

                        <div className="kpi-grid">
                            <div className="kpi-card orange">
                                <div className="bg-icon"><FaBriefcase size={80} /></div>
                                <div className="content">
                                    <p className="kpi-label">Carga Excessiva</p>
                                    <div className="kpi-value-group">
                                        <span className="number">{countDemanda}</span>
                                        <span className="unit">registros</span>
                                    </div>
                                    <p className="kpi-desc">Relatos de volume de trabalho acima do normal.</p>
                                </div>
                            </div>

                            <div className="kpi-card indigo">
                                <div className="bg-icon"><FaBed size={80} /></div>
                                <div className="content">
                                    <p className="kpi-label">Sono Prejudicado</p>
                                    <div className="kpi-value-group">
                                        <span className="number">{countSono}</span>
                                        <span className="unit">registros</span>
                                    </div>
                                    <p className="kpi-desc">Colaboradores reportando noites mal dormidas.</p>
                                </div>
                            </div>

                            <div className="kpi-card rose">
                                <div className="bg-icon"><FaBatteryQuarter size={80} /></div>
                                <div className="content">
                                    <p className="kpi-label">Energia Crítica</p>
                                    <div className="kpi-value-group">
                                        <span className="number">{countEnergia}</span>
                                        <span className="unit">registros</span>
                                    </div>
                                    <p className="kpi-desc">Níveis 1 ou 2 de energia (sinal de exaustão).</p>
                                </div>
                            </div>
                        </div>

                        <div className="table-card">
                            <div className="table-header-actions">
                                <h3><FaRegComments /> Detalhamento dos Relatos</h3>
                                <button
                                    onClick={() => setFiltroRisco(!filtroRisco)}
                                    className={`btn-filter ${filtroRisco ? "active" : "inactive"}`}
                                >
                                    {filtroRisco ? <FaTimes /> : <FaFilter />}
                                    {filtroRisco ? "Ver Todos" : "Filtrar Riscos"}
                                </button>
                            </div>

                            <div className="table-responsive">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Data</th>
                                            <th className="text-center">Energia</th>
                                            <th>Sentimento</th>
                                            <th>Demanda</th>
                                            <th className="w-1/3">Relato / Bloqueio</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {checkinsFiltrados.length === 0 ? (
                                            <tr className="empty-state">
                                                <td colSpan={5}>Nenhum dado encontrado com os filtros atuais.</td>
                                            </tr>
                                        ) : (
                                            checkinsFiltrados.map((item) => (
                                                <tr key={item.id} className="data-row">
                                                    <td className="date-col">
                                                        {new Date(item.dataCheckin).toLocaleDateString('pt-BR')}
                                                    </td>
                                                    <td className="energy-col">
                                                        <div className={`dot-energy ${item.nivelEnergia <= 2 ? 'low' : item.nivelEnergia === 3 ? 'med' : 'high'
                                                            }`}></div>
                                                        <span className="font-bold text-gray-700">{item.nivelEnergia}</span>
                                                    </td>
                                                    <td>
                                                        <span className="badge-sentiment">{item.sentimento}</span>
                                                    </td>
                                                    <td>
                                                        {item.volumeDemandas === 'Excessiva' ? (
                                                            <span className="badge-demand excessive">Excessiva</span>
                                                        ) : (
                                                            <span className="badge-demand normal">{item.volumeDemandas}</span>
                                                        )}
                                                    </td>
                                                    <td className="comment-col">
                                                        {item.bloqueios || "-"}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="right-column">
                        <h2><FaExclamationTriangle className="text-rose-500" /> Atenção Prioritária</h2>

                        <div className="risk-container">
                            <div className="risk-header">
                                <h3>Equipes em Risco</h3>
                                <span className="badge-count">{equipesRisco.length}</span>
                            </div>

                            {equipesRisco.length > 0 ? (
                                <div className="space-y-3">
                                    {equipesRisco.map(eq => (
                                        <div key={eq.equipeId} className="team-card">
                                            <div className="team-name-row">
                                                <span className="name">{eq.nomeEquipe}</span>
                                                <FaArrowRight className="icon" />
                                            </div>
                                            <div className="team-stats-row">
                                                <span className="label">Média Energia</span>
                                                <span className="value">{eq.mediaNivelHumor.toFixed(1)}</span>
                                            </div>
                                            <div className="progress-bar-bg">
                                                <div className="progress-fill" style={{ width: `${(eq.mediaNivelHumor / 5) * 100}%` }}></div>
                                            </div>
                                            <p className="footer-text">Base: {eq.totalCheckins} respostas</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-risk">
                                    <div className="icon-ok"><FaCheckCircle size={24} /></div>
                                    <p>Nenhuma equipe na zona de risco.</p>
                                </div>
                            )}
                        </div>

                        <div className="tip-card">
                            <h3>Dica do Sistema</h3>
                            <p>
                                Equipes com <strong>demanda excessiva</strong> recorrente têm 60% mais chance de burnout.
                                Considere redistribuir tarefas nas equipes listadas acima.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
