import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaStar, FaLock, FaSignOutAlt, FaTimes, FaSave } from "react-icons/fa";

// Serviços e Tipos
import { listarRecursosFavoritos, atualizarFuncionario } from "../../services/apiService";
import type { FuncionarioTO, RecursoBemEstarTO } from "../../types/api";

// Helper para Sessão
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

export default function Perfil() {
    const navigate = useNavigate();

    // Estados de Dados
    const [favoritos, setFavoritos] = useState<RecursoBemEstarTO[]>([]);
    const [funcionario, setFuncionario] = useState<FuncionarioTO | null>(getSessionFuncionario);

    // Estados de Controle
    const [isLoadingFavoritos, setIsLoadingFavoritos] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Estados do Modal de Senha
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

    // Proteção de Rota
    useEffect(() => {
        if (!funcionario) {
            navigate("/login");
        }
    }, [funcionario, navigate]);

    // Carregar Favoritos
    useEffect(() => {
        if (!funcionario?.id) return;

        let isMounted = true;

        async function loadData() {
            setIsLoadingFavoritos(true);
            setError(null);
            try {
                const favs = await listarRecursosFavoritos(funcionario!.id);

                if (isMounted) {
                    if (Array.isArray(favs)) {
                        setFavoritos(favs);
                    } else {
                        setFavoritos([]);
                    }
                }
            } catch (err: unknown) {
                if (isMounted) {
                    console.error(err);
                    setError("Não foi possível carregar seus favoritos no momento.");
                }
            } finally {
                if (isMounted) setIsLoadingFavoritos(false);
            }
        }

        loadData();

        return () => { isMounted = false; };
    }, [funcionario?.id]);

    // Logout Manual
    const handleLogout = () => {
        localStorage.removeItem('session_funcionario');
        navigate("/login");
    };

    // Lógica de Alteração de Senha
    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError(null);
        setPasswordSuccess(null);

        if (!funcionario) return;

        // Validações básicas
        if (novaSenha.length < 6) {
            setPasswordError("A nova senha deve ter no mínimo 6 caracteres.");
            return;
        }
        if (novaSenha !== confirmarSenha) {
            setPasswordError("As senhas não coincidem.");
            return;
        }

        setIsSavingPassword(true);

        try {
            const funcionarioAtualizado: FuncionarioTO = {
                ...funcionario,
                senha: novaSenha
            };

            const sucesso = await atualizarFuncionario(funcionario.id, funcionarioAtualizado);

            if (sucesso) {
                setPasswordSuccess("Senha alterada com sucesso!");
                setNovaSenha("");
                setConfirmarSenha("");

                localStorage.setItem('session_funcionario', JSON.stringify(funcionarioAtualizado));
                setFuncionario(funcionarioAtualizado);

                setTimeout(() => {
                    setIsPasswordModalOpen(false);
                    setPasswordSuccess(null);
                }, 2000);
            } else {
                setPasswordError("Erro ao atualizar senha. Tente novamente.");
            }
        } catch (error) {
            setPasswordError("Falha de comunicação com o servidor.");
        } finally {
            setIsSavingPassword(false);
        }
    };

    if (!funcionario) return null;

    return (
        <main className="profile-page">
            <div className="content-wrapper">

                <div className="profile-header">
                    <div className="user-info">
                        <div className="avatar-box">
                            <FaUserCircle />
                        </div>
                        <div className="details">
                            <h1>{funcionario.nome}</h1>
                            <p>{funcionario.email}</p>
                            <div className="tags">
                                <span className="tag role">
                                    Função ID: {funcionario.idFuncao}
                                </span>
                                <span className="tag date">
                                    Contratado em: {new Date(funcionario.dataContratacao).toLocaleDateString('pt-BR')}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="actions">
                        <button
                            onClick={() => setIsPasswordModalOpen(true)}
                            className="btn-action password"
                        >
                            <FaLock /> Alterar Senha
                        </button>
                        <button
                            onClick={handleLogout}
                            className="btn-action logout"
                        >
                            <FaSignOutAlt /> Sair da Conta
                        </button>
                    </div>
                </div>

                <section className="favorites-section">
                    <h2>
                        <FaStar className="text-yellow-500" /> Meus Recursos Favoritos
                    </h2>

                    {isLoadingFavoritos ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Carregando seus favoritos...</p>
                        </div>
                    ) : error ? (
                        <div className="error-state">
                            {error}
                        </div>
                    ) : favoritos.length === 0 ? (
                        <div className="empty-state">
                            <div className="icon-box">
                                <FaStar size={24} />
                            </div>
                            <h3>Sua lista está vazia</h3>
                            <p>
                                Você ainda não salvou nenhum conteúdo. Explore a biblioteca para encontrar materiais úteis.
                            </p>
                            <button
                                onClick={() => navigate("/recursos")}
                                className="btn-explore"
                            >
                                Ir para Biblioteca
                            </button>
                        </div>
                    ) : (
                        <div className="favorites-grid">
                            {favoritos.map(rec => (
                                <div key={rec.id} className="favorite-card">
                                    <div className="card-header">
                                        <div>
                                            <span className="type-badge">
                                                {rec.tipo}
                                            </span>
                                            <h3>{rec.nome}</h3>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <a
                                            href={rec.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="link-access"
                                        >
                                            Acessar Conteúdo &rarr;
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {isPasswordModalOpen && (
                <div className="password-modal-overlay">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h3>
                                <FaLock className="text-teal-600" /> Alterar Senha
                            </h3>
                            <button
                                onClick={() => setIsPasswordModalOpen(false)}
                                className="btn-close"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handlePasswordSubmit} className="modal-body">

                            {passwordError && (
                                <div className="alert-box error">
                                    {passwordError}
                                </div>
                            )}

                            {passwordSuccess && (
                                <div className="alert-box success">
                                    {passwordSuccess}
                                </div>
                            )}

                            <div className="input-group">
                                <label>Nova Senha</label>
                                <input
                                    type="password"
                                    value={novaSenha}
                                    onChange={(e) => setNovaSenha(e.target.value)}
                                    placeholder="Mínimo 6 caracteres"
                                    disabled={isSavingPassword}
                                />
                            </div>

                            <div className="input-group">
                                <label>Confirmar Nova Senha</label>
                                <input
                                    type="password"
                                    value={confirmarSenha}
                                    onChange={(e) => setConfirmarSenha(e.target.value)}
                                    placeholder="Repita a senha"
                                    disabled={isSavingPassword}
                                />
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    onClick={() => setIsPasswordModalOpen(false)}
                                    className="cancel"
                                    disabled={isSavingPassword}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="save"
                                    disabled={isSavingPassword}
                                >
                                    {isSavingPassword ? "Salvando..." : <><FaSave /> Salvar</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </main>
    );
}