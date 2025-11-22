import { useNavigate } from "react-router-dom";
import {
    BiTimeFive,
    BiData,
    BiCheckCircle,
    BiWorld
} from "react-icons/bi";
import {
    BsShieldLock,
    BsArrowRight
} from "react-icons/bs";

import { FEATURES_SOBRE } from "../../types/constants";


export default function Sobre() {
    const navigate = useNavigate();

    const iconMap = {
        dados: BiData,
        seguranca: BsShieldLock,
        agilidade: BiTimeFive
    };

    return (
        <main className="sobre-page">

            <section className="hero-section">
                <div className="blob-top"></div>
                <div className="blob-bottom"></div>

                <div className="hero-container">
                    <div className="badge-event">
                        <BiWorld /> Global Solution 2025
                    </div>

                    <h1>
                        O futuro do trabalho exige <br className="hidden md:block" />
                        mais do que tecnologia: exige <span className="highlight-dois">Humanidade</span>.
                    </h1>

                    <p className="hero-description">
                        Enquanto a automação transforma tarefas, o diferencial competitivo torna-se a saúde mental e a criatividade.
                        O <strong>Humanize</strong> é a ponte entre a eficiência da IA e o cuidado com as pessoas.
                    </p>

                    <div className="ods-wrapper">
                        <div className="ods-tag">
                            <span className="dot-green"></span> ODS 3: Saúde e Bem-Estar
                        </div>
                        <div className="ods-tag">
                            <span className="dot-blue"></span> ODS 8: Trabalho Decente
                        </div>
                    </div>
                </div>
            </section>

            <section className="main-content">
                <div className="content-container">
                    <div className="grid-layout">

                        <div className="text-column">
                            <div>
                                <h2>
                                    A "Síndrome do Invisível" no Modelo Híbrido
                                </h2>
                                <div className="divider-line"></div>
                            </div>

                            <p>
                                O Fórum Econômico Mundial alerta: <strong>23% das profissões vão mudar até 2027</strong>.
                                Nesse cenário de incerteza e alta pressão, o maior risco não é tecnológico, é humano.
                            </p>
                            <p>
                                Sem contato visual diário, líderes perdem a sensibilidade. O burnout cresce em silêncio.
                                Nossa solução usa dados para devolver essa visibilidade, permitindo uma gestão inclusiva e sustentável.
                            </p>

                            <ul className="benefits-list">
                                <li>
                                    <div className="icon-check"><BiCheckCircle /></div>
                                    <span>Identificação antecipada de sinais de burnout</span>
                                </li>
                                <li>
                                    <div className="icon-check"><BiCheckCircle /></div>
                                    <span>Ambiente de segurança psicológica e pertencimento</span>
                                </li>
                            </ul>
                        </div>

                        <div className="features-column">
                            {FEATURES_SOBRE.map((item) => {
                                const IconComponent = iconMap[item.id as keyof typeof iconMap];

                                return (
                                    <div key={item.id} className="feature-card">
                                        <div className={`icon-wrapper ${item.bgIcon}`}>
                                            <IconComponent className={`text-3xl ${item.iconColor}`} />
                                        </div>
                                        <div>
                                            <h3>{item.title}</h3>
                                            <p>{item.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                    </div>
                </div>
            </section>

            <section className="cta-section">
                <div className="cta-container">
                    <div className="cta-card">
                        <div className="circle-top"></div>
                        <div className="circle-bottom"></div>

                        <div className="inner-content">
                            <h2>Prepare sua empresa para o futuro.</h2>
                            <p>
                                Comece hoje a construir um ambiente de trabalho mais humano, resiliente e produtivo.
                            </p>

                            <div className="buttons-row">
                                <button
                                    onClick={() => navigate("/login")}
                                    className="btn-primary"
                                >
                                    Acessar Plataforma <BsArrowRight />
                                </button>
                                <button
                                    onClick={() => navigate("/contato")}
                                    className="btn-secondary"
                                >
                                    Falar com Consultor
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    );
}