import { FaGithub, FaLinkedin } from "react-icons/fa";
import { LISTA_MEMBROS } from "../../types/constants";

export default function Integrantes() {

    return (
        <main className="integrantes-page">
            <div className="content-wrapper">

                <header className="header-section">
                    <div className="subtitle-wrapper">
                        <span className="text-xl font-bold mt-1">FIAP - Global Solution 2025</span>
                    </div>

                    <h1>Equipe de Desenvolvimento Humanize</h1>
                    <p>
                        Somos alunos da turma 1TDSPH e desenvolvemos a plataforma Humanize como parte do desafio da Global Solution, focada em bem-estar e saúde mental no trabalho.
                    </p>
                </header>

                <div className="members-grid">
                    {LISTA_MEMBROS.map((membro) => (
                        <section key={membro.rm} className="member-card">
                            <img
                                src={membro.foto}
                                alt={`Foto de ${membro.nome}`}
                            />

                            <h2>{membro.nome}</h2>
                            <p className="rm-text">RM - {membro.rm}</p>
                            <p className="class-text">Turma - 1TDSPH</p>

                            <div className="social-links">
                                <a
                                    href={membro.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="icon-btn github"
                                    title={`Perfil GitHub de ${membro.nome}`}
                                >
                                    <FaGithub size={35} />
                                </a>

                                <a
                                    href={membro.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="icon-btn linkedin"
                                    title={`Perfil LinkedIn de ${membro.nome}`}
                                >
                                    <FaLinkedin size={35} />
                                </a>
                            </div>
                        </section>
                    ))}
                </div>

                <div className="page-footer">
                    <p>Orgulhosamente desenvolvido por estudantes de Análise e Desenvolvimento de Sistemas da FIAP.</p>
                </div>

            </div>
        </main>
    );
}