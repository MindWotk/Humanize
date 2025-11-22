import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaTimes, FaSave } from "react-icons/fa";

// Importação dos tipos da API e de UI
import type { FuncionarioTO } from "../../types/api";
import type { ModalEditarProps } from "../../types/ui";

export default function ModalEditarFuncionario({
    funcionario,
    equipes,
    funcoes,
    onCancel,
    onSave
}: ModalEditarProps) {

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FuncionarioTO>();

    useEffect(() => {
        if (funcionario) {
            const dataStr = typeof funcionario.dataContratacao === 'string'
                ? funcionario.dataContratacao.split('T')[0]
                : new Date(funcionario.dataContratacao).toISOString().split('T')[0];

            const formValues: FuncionarioTO = {
                ...funcionario,
                dataContratacao: dataStr,
            };

            reset(formValues);
        }
    }, [funcionario, reset]);
    if (!funcionario) return null;

    return (
        <div className="modal-editar-funcionario">

            <div className="modal-editando-x">
                <h2 className="texto-editando">
                    Editando: <span className="texto-funcionario">{funcionario.nome}</span>
                </h2>
                <button
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="btn-fechar-editar-funcionario"
                    title="Fechar edição"
                >
                    <FaTimes className="icone-btn-fechar-editar-funcionario" />
                </button>
            </div>

            <form onSubmit={handleSubmit(onSave)} className="form-editar-funcionario">

                <div>
                    <label className="label-nome-funcionario">Nome</label>
                    <input
                        {...register("nome", { required: "O nome é obrigatório", minLength: { value: 3, message: "Mínimo 3 caracteres" } })}
                        disabled={isSubmitting}
                        className="input-nome-funcionario"
                    />
                    {errors.nome && <span className="erro-nome-editar-funcionario">{errors.nome.message}</span>}
                </div>

                <div>
                    <label className="label-email-funcionario">Email</label>
                    <input
                        {...register("email", { required: "Email obrigatório" })}
                        disabled={isSubmitting}
                        className="input-email-funcionario"
                    />
                    {errors.email && <span className="erro-email-editar-funcionario">{errors.email.message}</span>}
                </div>

                <div>
                    <label className="label-funcao-funcionario">Função</label>
                    <select
                        {...register("idFuncao", { required: true })}
                        disabled={isSubmitting}
                        className="select-funcao-funcionario"
                    >
                        {funcoes.map(f => (
                            <option key={f.id} value={f.id}>{f.nome}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="label-equipe-funcionario">Equipe</label>
                    <select
                        {...register("equipeId", { required: true })}
                        disabled={isSubmitting}
                        className="select-equipe-funcionario"
                    >
                        {equipes.map(e => (
                            <option key={e.id} value={e.id}>
                                {e.nome} [{e.sigla}]
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="label-data-funcionario">Data Contratação</label>
                    <input
                        type="date"
                        {...register("dataContratacao", { required: "Data obrigatória" })}
                        disabled={isSubmitting}
                        className="input-data-funcionario"
                    />
                    {errors.dataContratacao && <span className="erro-data-editar-funcionario">{errors.dataContratacao.message}</span>}
                </div>

                <div>
                    <label className="label-senha-funcionario">Senha (Deixe vazio para manter a atual)</label>
                    <input
                        type="password"
                        {...register("senha")}
                        disabled={isSubmitting}
                        className="input-senha-funcionario"
                    />
                    {errors.senha && <span className="erro-senha-editar-funcionario">{errors.senha.message}</span>}
                </div>

                <div className="btn-editar-salvar-cancelar">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="btn-cancelar-editar-funcionario"
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-salvar-editar-funcionario"
                    >
                        {isSubmitting ? (
                            "Salvando..."
                        ) : (
                            <>
                                <FaSave /> Salvar Alterações
                            </>
                        )}
                    </button>



                </div>
            </form>
        </div>
    );
}