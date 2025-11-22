import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FaLock, FaUserCircle } from "react-icons/fa";

// Importações do projeto
import type { LoginFormData } from "../../types/forms";
import type { LoginTO } from "../../types/api";
import { autenticarFuncionario } from "../../services/apiService";
import { PERFIS_DASHBOARD } from "../../types/constants";



export default function Login() {
    const navigate = useNavigate();

    const [apiError, setApiError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
    } = useForm<LoginFormData>({
        mode: "onChange",
    });

    const handleLogin: SubmitHandler<LoginFormData> = async (data) => {
        setApiError(null);
        setIsLoading(true);

        try {
            const payload: LoginTO = {
                email: data.email,
                senha: data.senha,
            };

            const { user, error } = await autenticarFuncionario(payload);

            if (user) {
                localStorage.setItem(
                    "session_funcionario",
                    JSON.stringify(user)
                );

                reset();

                if (PERFIS_DASHBOARD.includes(user.idFuncao)) {
                    navigate("/dashboard");
                } else {
                    navigate("/checkin");
                }
                return;

            } else if (error) {
                setApiError(error);
            }
        } catch (error) {
            setApiError("Não foi possível conectar ao servidor. Verifique sua conexão.");
            console.error("Erro crítico no login:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="login-page">
            <div className="login-card">

                <div className="card-header">
                    <FaUserCircle size={50} className="icon" />
                    <h1>Acesso Humanize</h1>
                    <p>Bem-vindo de volta! Acesse sua conta corporativa.</p>
                </div>

                {apiError && (
                    <div className="alert-box" role="alert">
                        <span>{apiError}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit(handleLogin)} noValidate className="login-form">

                    <div className="input-group">
                        <label htmlFor="email">E-mail Corporativo</label>
                        <input
                            type="email"
                            id="email"
                            className={errors.email ? 'has-error' : ''}
                            placeholder="seu.email@empresa.com"
                            {...register("email", {
                                required: "O e-mail é obrigatório.",
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: "Insira um formato de e-mail válido.",
                                },
                            })}
                            disabled={isLoading}
                        />
                        {errors.email && <p className="error-msg">{errors.email.message}</p>}
                    </div>

                    <div className="input-group">
                        <label htmlFor="senha">Senha</label>
                        <input
                            type="password"
                            id="senha"
                            className={errors.senha ? 'has-error' : ''}
                            placeholder="••••••••"
                            {...register("senha", {
                                required: "A senha é obrigatória.",
                                minLength: {
                                    value: 3,
                                    message: "A senha deve ter no mínimo 3 caracteres.",
                                },
                            })}
                            disabled={isLoading}
                        />
                        {errors.senha && <p className="error-msg">{errors.senha.message}</p>}
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="btn-login"
                            disabled={isLoading || !isValid}
                        >
                            {isLoading ? (
                                <div className="spinner"></div>
                            ) : (
                                <FaLock />
                            )}
                            {isLoading ? "Autenticando..." : "Entrar"}
                        </button>
                    </div>
                </form>

                <div className="card-footer">
                    <p>
                        Não consegue entrar?
                    </p>
                    <p className="word-color">
                        Contate o seu RH
                    </p>

                </div>
            </div>
        </main>
    );
}