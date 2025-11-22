import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    FaUser,
    FaBars,
    FaTimes,
    FaSun,
    FaMoon,
    FaSearchPlus,
    FaSearchMinus,
    FaChevronDown,
    FaBuilding,
    FaCog,
    FaHome,
    FaClipboardList,
    FaChartLine
} from "react-icons/fa";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { useTheme } from "../ThemeContext/useTheme";
import type { FuncionarioTO } from "../../types/api";
import type { DropdownProps } from "../../types/ui";
import {
    ID_FUNCAO_RH,
    PERFIS_DASHBOARD
} from "../../types/constants";

const getInitialUser = (): FuncionarioTO | null => {
    if (typeof window !== "undefined") {
        const usuarioJSON = localStorage.getItem("session_funcionario");
        if (usuarioJSON) {
            try {
                return JSON.parse(usuarioJSON) as FuncionarioTO;
            } catch {
                return null;
            }
        }
    }
    return null;
};

export default function Menu() {
    const [isOpen, setIsOpen] = useState(false);
    const [usuarioLogado, setUsuarioLogado] = useState<FuncionarioTO | null>(getInitialUser);

    const [mobileGestaoOpen, setMobileGestaoOpen] = useState(false);
    const [mobileInstOpen, setMobileInstOpen] = useState(false);

    const [showAdminMenu, setShowAdminMenu] = useState(false);
    const [showInstMenu, setShowInstMenu] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { isDark, toggleTheme } = useTheme();

    const isActive = (path: string) => location.pathname === path;

    useEffect(() => {
        setUsuarioLogado(getInitialUser());
        setIsOpen(false);
        setMobileGestaoOpen(false);
        setMobileInstOpen(false);
        setShowAdminMenu(false);
        setShowInstMenu(false);
    }, [location.pathname]);

    useEffect(() => {
        if (isDark) {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
    }, [isDark]);

    const [fontSize, setFontSize] = useState(() => {
        const savedSize = localStorage.getItem("fontSize");
        return savedSize ? parseInt(savedSize, 10) : 16;
    });

    useEffect(() => {
        document.documentElement.style.fontSize = `${fontSize}px`;
        localStorage.setItem("fontSize", fontSize.toString());
    }, [fontSize]);

    const increaseFontSize = () => setFontSize((current) => Math.min(current + 2, 20));
    const decreaseFontSize = () => setFontSize((current) => Math.max(current - 2, 12));

    const handleLogout = () => {
        localStorage.removeItem("session_funcionario");
        setUsuarioLogado(null);
        setIsOpen(false);
        navigate("/login");
    };

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    const isDashboardUser = usuarioLogado && PERFIS_DASHBOARD.includes(usuarioLogado.idFuncao);
    const isRH = usuarioLogado?.idFuncao === ID_FUNCAO_RH;

    const Dropdown = ({ title, icon: Icon, isOpen, setIsOpen, children }: DropdownProps) => (
        <div className="dropdown-group"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}>
            <button
                className="dropdown-btn"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <Icon /> {title}
                <FaChevronDown className={`chevron ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="dropdown-content">
                    {children}
                </div>
            )}
        </div>
    );

    return (
        <nav className="menu-navbar">
            <div className="menu-container">
                <Link to="/" className="logo-link" onClick={closeMenu}>
                    <img src="/img/logo-humanize.png" alt="Logo Humanize" />
                </Link>

                <div className="desktop-nav">
                    <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Início</Link>

                    {usuarioLogado && (
                        <>
                            <Link to="/perfil" className={`nav-link ${isActive('/perfil') ? 'active' : ''}`}>Perfil</Link>
                            <Link to="/checkin" className={`nav-link ${isActive('/checkin') ? 'active' : ''}`}>Check-in</Link>
                            <Link to="/recursos" className={`nav-link ${isActive('/recursos') ? 'active' : ''}`}>Recursos</Link>

                            {isDashboardUser && (
                                <Link to="/dashboard" className={`nav-link-dashboard ${isActive('/dashboard') ? 'active' : ''}`}>Dashboard</Link>
                            )}

                            {isRH && (
                                <Dropdown title="Gestão" icon={FaCog} isOpen={showAdminMenu} setIsOpen={setShowAdminMenu}>
                                    <Link to="/admin/funcionarios" className="dropdown-item">
                                        Gerir Pessoas
                                    </Link>
                                    <Link to="/admin/recursos" className="dropdown-item">
                                        Gerir Conteúdo
                                    </Link>
                                </Dropdown>
                            )}
                        </>
                    )}

                    <Dropdown title="Sobre" icon={FaBuilding} isOpen={showInstMenu} setIsOpen={setShowInstMenu}>
                        <Link to="/integrantes" className="dropdown-item">Integrantes</Link>
                        <Link to="/faq" className="dropdown-item">Dúvidas (FAQ)</Link>
                        <Link to="/contato" className="dropdown-item">Fale Conosco</Link>
                        <Link to="/sobre" className="dropdown-item">Sobre</Link>
                    </Dropdown>
                </div>

                <div className="controls-section">
                    <div className="font-theme-wrapper">
                        <button onClick={decreaseFontSize} className="control-btn"><FaSearchMinus /></button>
                        <button onClick={increaseFontSize} className="control-btn"><FaSearchPlus /></button>
                        <div className="divider"></div>
                        <button onClick={toggleTheme} className="control-btn">
                            {isDark ? <FaSun /> : <FaMoon />}
                        </button>
                    </div>

                    {usuarioLogado ? (
                        <div className="user-wrapper">
                            <Link to="/perfil" className="profile-link">
                                <span className="welcome-text">Bem-vindo,</span>
                                <span className="name-text">
                                    {usuarioLogado.nome.split(' ')[0]}
                                </span>
                            </Link>
                            <button onClick={handleLogout} className="btn-logout" title="Sair">
                                <FaArrowRightFromBracket />
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn-login">
                            <FaUser /> Entrar
                        </Link>
                    )}
                </div>

                <button className="mobile-toggle-btn" onClick={toggleMenu} aria-label="Abrir menu">
                    {isOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            <div className={`mobile-menu-container ${isOpen ? 'is-open' : 'is-closed'}`}>
                <div className="mobile-content">

                    <Link to="/" className={`mobile-link ${isActive('/') ? 'active' : ''}`} onClick={closeMenu}>
                        <FaHome className="text-lg" /> Início
                    </Link>

                    {usuarioLogado && (
                        <>
                            <Link to="/perfil" className={`mobile-link ${isActive('/perfil') ? 'active' : ''}`} onClick={closeMenu}>
                                <FaUser /> Meu Perfil
                            </Link>

                            <Link to="/checkin" className={`mobile-link ${isActive('/checkin') ? 'active' : ''}`} onClick={closeMenu}>
                                <FaClipboardList /> Check-in Diário
                            </Link>

                            <Link to="/recursos" className={`mobile-link ${isActive('/recursos') ? 'active' : ''}`} onClick={closeMenu}>
                                <FaBuilding /> Biblioteca de Recursos
                            </Link>

                            {isDashboardUser && (
                                <Link to="/dashboard" className={`mobile-link ${isActive('/dashboard') ? 'active' : ''}`} onClick={closeMenu}>
                                    <FaChartLine /> Dashboard
                                </Link>
                            )}

                            {isRH && (
                                <div className="mobile-accordion-group">
                                    <button
                                        className={`mobile-accordion-btn ${mobileGestaoOpen ? 'open' : ''}`}
                                        onClick={() => setMobileGestaoOpen(!mobileGestaoOpen)}
                                    >
                                        <span className="flex items-center gap-2"><FaCog /> Gestão RH</span>
                                        <FaChevronDown className={`transition-transform ${mobileGestaoOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {mobileGestaoOpen && (
                                        <div className="mobile-accordion-content">
                                            <Link to="/admin/funcionarios" className="mobile-sub-link" onClick={closeMenu}>Gerir Pessoas</Link>
                                            <Link to="/admin/recursos" className="mobile-sub-link" onClick={closeMenu}>Gerir Conteúdo</Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    <div className="mobile-accordion-group border-t border-gray-100 pt-2 mt-2 dark:border-gray-700">
                        <button
                            className={`mobile-accordion-btn ${mobileInstOpen ? 'open' : ''}`}
                            onClick={() => setMobileInstOpen(!mobileInstOpen)}
                        >
                            <span className="flex items-center gap-2"><FaBuilding /> Institucional</span>
                            <FaChevronDown className={`transition-transform ${mobileInstOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {mobileInstOpen && (
                            <div className="mobile-accordion-content">
                                <Link to="/sobre" className="mobile-sub-link" onClick={closeMenu}>Sobre</Link>
                                <Link to="/integrantes" className="mobile-sub-link" onClick={closeMenu}>Integrantes</Link>
                                <Link to="/faq" className="mobile-sub-link" onClick={closeMenu}>FAQ</Link>
                                <Link to="/contato" className="mobile-sub-link" onClick={closeMenu}>Contato</Link>
                            </div>
                        )}
                    </div>

                    <div className="mobile-footer">
                        <button onClick={toggleTheme} className="btn-theme-mobile">
                            {isDark ? <FaSun /> : <FaMoon />} <span>Tema</span>
                        </button>

                        {usuarioLogado ? (
                            <button onClick={handleLogout} className="btn-logout-mobile">
                                Sair <FaArrowRightFromBracket />
                            </button>
                        ) : (
                            <Link to="/login" className="btn-login-mobile" onClick={closeMenu}>
                                Fazer Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}