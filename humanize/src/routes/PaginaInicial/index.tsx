import { BsHeartPulse, BsShieldCheck, BsBarChart } from "react-icons/bs";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function PaginaInicial() {
    return (
        <main className="home-page">

            <section className="hero-section">
                <div
                    className="bg-image"
                    style={{ backgroundImage: "url('/img/fundo.png')" }}
                ></div>
                <div className="bg-overlay"></div>

                <div className="hero-content">
                    <span className="badge">
                        Plataforma de Saúde Corporativa
                    </span>
                    <h1>
                        Combata o Burnout e fortaleça sua equipe no <span>modelo híbrido</span>.
                    </h1>
                    <p>
                        A plataforma de inteligência emocional que monitora o bem-estar e fornece dados
                        para uma gestão mais humana, preventiva e produtiva.
                    </p>
                    <Link to="/sobre" className="btn-hero">
                        Conhecer a Solução <FaArrowRight />
                    </Link>
                </div>
            </section>

            <section className="quick-access-section">
                <div className="container-wrapper">

                    <div className="section-header">
                        <h2>Acesso Rápido</h2>
                        <p>Escolha por onde começar sua jornada de cuidado</p>
                    </div>

                    <div className="cards-grid">

                        <Link to="/checkin" className="access-card variant-red">
                            <div className="decorative-circle"></div>
                            <div className="icon-box">
                                <BsHeartPulse size={32} />
                            </div>
                            <h3>Check-in de Humor</h3>
                            <p>
                                Responda ao questionário diário para monitorar sua energia e humor.
                            </p>
                            <span className="link-action">
                                Iniciar agora <FaArrowRight />
                            </span>
                        </Link>

                        <Link to="/recursos" className="access-card variant-blue">
                            <div className="decorative-circle"></div>
                            <div className="icon-box">
                                <BsShieldCheck size={32} />
                            </div>
                            <h3>Biblioteca de Bem-Estar</h3>
                            <p>
                                Acesse artigos, vídeos e materiais selecionados para saúde mental e foco.
                            </p>
                            <span className="link-action">
                                Explorar conteúdos <FaArrowRight />
                            </span>
                        </Link>

                        <Link to="/dashboard" className="access-card variant-purple">
                            <div className="decorative-circle"></div>
                            <div className="icon-box">
                                <BsBarChart size={32} />
                            </div>
                            <h3>Dashboard de Gestão</h3>
                            <p>
                                Visualize relatórios de média de humor e identifique padrões de estresse.
                            </p>
                            <span className="link-action">
                                Ver indicadores <FaArrowRight />
                            </span>
                        </Link>

                    </div>
                </div>
            </section>

            <section className="cta-section">
                <div className="cta-content">
                    <h2>
                        Transformamos dados anônimos em <span>decisões de cuidado</span>.
                    </h2>
                    <p>
                        Nós fornecemos as ferramentas para o acompanhamento e a prevenção do estresse crônico,
                        criando ambientes de trabalho mais saudáveis e sustentáveis.
                    </p>

                    <Link to="/sobre" className="link-about">
                        Saiba mais sobre nossa metodologia &rarr;
                    </Link>
                </div>
            </section>

        </main>
    );
}