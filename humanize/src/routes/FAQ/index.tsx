import { useState } from "react";
import { Link } from "react-router-dom";
import {
    FaChevronDown,
    FaUserSecret,
    FaChartPie,
    FaHeartbeat,
    FaShieldAlt,
    FaRegComments
} from "react-icons/fa";

// Import dos dados constantes
import { FAQ_ITEMS } from "../../types/constants";

export default function FAQ() {
    // Estado para controlar qual pergunta está aberta
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleQuestion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    // Mapa de ícones
    const iconMap = {
        humanize: FaHeartbeat,
        anonimato: FaUserSecret,
        dados: FaChartPie,
        alerta: FaShieldAlt,
        frequencia: FaRegComments
    };

    return (
        <main className="faq-page">
            <div className="faq-container">

                <header className="faq-header">
                    <h1>Perguntas Frequentes</h1>
                    <p>
                        Tire suas dúvidas sobre como o Humanize protege seus dados e ajuda sua equipe.
                    </p>
                </header>

                <div className="faq-list">
                    {FAQ_ITEMS.map((item, index) => {
                        const isOpen = openIndex === index;
                        
                        const IconComponent = iconMap[item.id as keyof typeof iconMap];

                        return (
                            <div
                                key={item.id}
                                className={`faq-item ${isOpen ? "open" : ""}`}
                            >
                                <button
                                    onClick={() => toggleQuestion(index)}
                                    className="faq-btn"
                                >
                                    <div className="faq-header-content">
                                        <div className="icon-box">
                                            <IconComponent className={item.iconColor} />
                                        </div>
                                        <h3 className="question-text">
                                            {item.question}
                                        </h3>
                                    </div>
                                    <div className="chevron-icon">
                                        <FaChevronDown />
                                    </div>
                                </button>

                                <div className="answer-wrapper">
                                    <div className="answer-text">
                                        {item.answer}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="cta-box">
                    <h3>Ainda tem dúvidas?</h3>
                    <p>
                        Nossa equipe de suporte está pronta para ajudar você em qualquer questão específica.
                    </p>
                    <Link to="/contato" className="cta-btn">
                        Fale Conosco
                    </Link>
                </div>

            </div>
        </main>
    );
}