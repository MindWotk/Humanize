import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaExternalLinkAlt, FaBookOpen, FaVideo, FaHeadphones, FaFileAlt, FaSearch } from "react-icons/fa";

import {
    buscarRecursos,
    listarRecursosFavoritos,
    adicionarRecursoFavorito,
    removerRecursoFavorito
} from "../../services/apiService";
import type { FuncionarioTO, RecursoBemEstarTO } from "../../types/api";

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

const getIconByType = (tipo: string | undefined | null) => {
    const t = (tipo || "").toLowerCase();
    if (t.includes("vídeo") || t.includes("video")) return <FaVideo className="text-xl" />;
    if (t.includes("áudio") || t.includes("audio") || t.includes("podcast")) return <FaHeadphones className="text-xl" />;
    if (t.includes("livro") || t.includes("e-book") || t.includes("artigo")) return <FaBookOpen className="text-xl" />;
    return <FaFileAlt className="text-xl" />;
};

export default function Recursos() {
    const navigate = useNavigate();

    const [recursos, setRecursos] = useState<RecursoBemEstarTO[]>([]);
    const [favoritosIds, setFavoritosIds] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const funcionario = getSessionFuncionario();
    useEffect(() => {
        if (!funcionario) {
            alert("Você precisa estar logado para acessar a biblioteca.");
            navigate("/login");
            return;
        }

        let isMounted = true;

        async function loadData() {
            setIsLoading(true);
            setError(null);
            try {
                const [todosRecursos, meusFavoritos] = await Promise.all([
                    buscarRecursos(),
                    listarRecursosFavoritos(funcionario!.id)
                ]);

                if (isMounted) {
                    setRecursos(Array.isArray(todosRecursos) ? todosRecursos : []);
                    const favs = Array.isArray(meusFavoritos) ? meusFavoritos : [];
                    setFavoritosIds(favs.map(r => r.id));
                }
            } catch (err) {
                if (isMounted) {
                    console.error(err);
                    setError("Não foi possível carregar a biblioteca de recursos.");
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        loadData();
        return () => { isMounted = false; };
    }, [funcionario?.id, navigate]);

    const toggleFavorite = async (recursoId: number) => {
        if (!funcionario) return;

        const isFav = favoritosIds.includes(recursoId);

        setFavoritosIds(prev =>
            isFav ? prev.filter(id => id !== recursoId) : [...prev, recursoId]
        );

        try {
            let sucesso;
            if (isFav) {
                sucesso = await removerRecursoFavorito(funcionario.id, recursoId);
            } else {
                sucesso = await adicionarRecursoFavorito(funcionario.id, recursoId);
            }

            if (!sucesso) throw new Error("Falha na API");
        } catch (error) {
            alert("Erro ao atualizar favoritos. Tente novamente.");
            setFavoritosIds(prev =>
                isFav ? [...prev, recursoId] : prev.filter(id => id !== recursoId)
            );
        }
    };

    if (!funcionario) return null;

    if (isLoading) {
        return (
            <main className="loading-wrapper">
                <div className="loading-content">
                    <div className="spinner"></div>
                    <p>Carregando biblioteca...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="recursos-page">
            <div className="page-container">
                <header className="page-header">
                    <h1>Biblioteca de Bem-Estar</h1>
                    <p>
                        Explore nossa curadoria de conteúdos para melhorar seu foco, saúde mental e ergonomia.
                        Marque seus preferidos para acesso rápido.
                    </p>
                </header>

                {error && (
                    <div className="error-box">
                        <p>{error}</p>
                    </div>
                )}

                {!error && recursos.length === 0 && (
                    <div className="empty-box">
                        <FaSearch className="icon-search" />
                        <p className="text-main">Nenhum recurso disponível no momento.</p>
                        <p className="text-sub">A biblioteca está sendo curada pela equipe de RH.</p>
                    </div>
                )}

                <div className="resources-grid">
                    {recursos.map((recurso) => {
                        const isFav = favoritosIds.includes(recurso.id);

                        return (
                            <div key={recurso.id} className="resource-card">
                                <div className="card-body">
                                    <div className="card-header">
                                        <span className="type-tag">
                                            {getIconByType(recurso.tipo)}
                                            {recurso.tipo}
                                        </span>

                                        <button
                                            onClick={() => toggleFavorite(recurso.id)}
                                            className="fav-button"
                                            title={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                                        >
                                            {isFav ? (
                                                <FaHeart className="text-2xl text-rose-500 drop-shadow-sm" />
                                            ) : (
                                                <FaRegHeart className="text-2xl text-gray-400 hover:text-rose-400 transition-colors" />
                                            )}
                                        </button>
                                    </div>

                                    <h3>{recurso.nome}</h3>
                                </div>

                                <div className="card-footer">
                                    <a
                                        href={recurso.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="access-link"
                                    >
                                        Acessar Recurso <FaExternalLinkAlt />
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}