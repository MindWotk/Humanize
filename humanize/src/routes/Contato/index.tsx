import { FaEnvelope, FaPhoneAlt, FaWhatsapp, FaClock, FaQuestionCircle, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Contato() {
    return (
        <main className="contact-page">
            <div className="content-wrapper">

                <header className="header-section">
                    <h1>Fale Conosco</h1>
                    <p>
                        Priorizamos um atendimento humanizado e eficiente. Seja para suporte,
                        esclarecimentos institucionais ou sugestões de melhoria, estamos prontos
                        para auxiliar e garantir a melhor experiência na plataforma.
                    </p>
                </header>

                <section className="contact-grid">

                    <a
                        href="mailto:oficialhumanize@gmail.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-card variant-blue"
                    >
                        <div className="icon-box">
                            <FaEnvelope />
                        </div>
                        <h3>E-mail</h3>
                        <p>Dúvidas gerais e suporte.</p>
                        <span className="link-text">
                            oficialhumanize@gmail.com
                        </span>
                    </a>

                    <a
                        href="https://wa.me/5511990145697"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-card variant-green"
                    >
                        <div className="icon-box">
                            <FaWhatsapp />
                        </div>
                        <h3>WhatsApp</h3>
                        <p>Atendimento ágil.</p>
                        <span className="link-text">
                            (11) 99014-5697
                        </span>
                    </a>

                    <a
                        href="tel:11990145697"
                        className="contact-card variant-purple"
                    >
                        <div className="icon-box">
                            <FaPhoneAlt />
                        </div>
                        <h3>Telefone</h3>
                        <p>Fale com um atendente.</p>
                        <span className="link-text">
                            (11) 99014-5697
                        </span>
                    </a>

                </section>

                <section className="faq-section">
                    <div className="faq-content">
                        <div className="faq-icon">
                            <FaQuestionCircle size={24} />
                        </div>
                        <div className="text-wrap">
                            <h3>Dúvidas Frequentes?</h3>
                            <p>
                                Acesse nossa central de ajuda antes de entrar em contato. Sua resposta pode estar lá!
                            </p>
                        </div>
                    </div>
                    <Link to="/faq" className="btn-faq">
                        Acessar FAQ <FaArrowRight className="text-sm" />
                    </Link>
                </section>

                <section className="hours-section">
                    <div className="bg-effect"></div>

                    <div className="hours-icon">
                        <FaClock />
                    </div>

                    <div className="hours-content">
                        <h3>Horário de Atendimento</h3>
                        <p>
                            Nossa equipe está disponível de <span className="font-semibold text-white">segunda à sexta-feira</span>.
                        </p>
                        <div className="time-badge">
                            <span>08:00 às 18:00</span>
                        </div>
                    </div>
                </section>

            </div>
        </main>
    );
}