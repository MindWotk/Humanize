import { FaEdit, FaTrash } from "react-icons/fa";
import type { ListaFuncionariosProps } from "../../types/ui";

export default function ListaFuncionarios({
    funcionarios,
    funcoes,
    onEdit,
    onDelete,
    isLoading,
    editingId
}: ListaFuncionariosProps) {

    if (isLoading && funcionarios.length === 0) {
        return (
            <div className="carregamento-colaboradores">
                <div className="carregamento-colabradores-dois"></div>
                <p className="texto-carregamento-colaboradores">Carregando colaboradores...</p>
            </div>
        );
    }

    if (!isLoading && funcionarios.length === 0) {
        return (
            <div className="nenhum-carregamento-colaboradores">
                <p className="texto-nenhum-carregamento-colaboradores">Nenhum funcionário encontrado.</p>
            </div>
        );
    }

    return (
        <div className="listar-funcionario">
            <div className="tabela-listar-funcionario">
                <table className="tabela-listar-funcionario-dois">
                    <thead className="cabecalho-tabela-listar-funcionario">
                        <tr>
                            <th className="th-cabecalho-tabela-funcionario">ID</th>
                            <th className="th-cabecalho-tabela-funcionario">Nome</th>
                            <th className="th-cabecalho-tabela-funcionario">Email</th>
                            <th className="th-cabecalho-tabela-funcionario">Perfil</th>
                            <th className="th-cabecalho-tabela-funcionario-acoes">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="linha-tabela-listar-funcionario">
                        {funcionarios.map((func) => (
                            <tr
                                key={func.id}
                                className={`linha-tabela-listar-funcionario-id ${editingId === func.id ? "bg-yellow-50" : ""}`}
                            >
                                <td className="coluna-tabela-listar-funcionario-id">#{func.id}</td>
                                <td className="coluna-tabela-listar-funcionario-nome">{func.nome}</td>
                                <td className="coluna-tabela-listar-funcionario-email">{func.email}</td>

                                <td className="coluna-tabela-listar-funcionario-funcao">
                                    <span className={`coluna-tabela-listar-funcionario-funcao-dois ${func.idFuncao === 5 ? 'bg-purple-100 text-purple-700' :
                                        func.idFuncao === 3 || func.idFuncao === 4 ? 'bg-blue-100 text-blue-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                        {funcoes.find(f => f.id === func.idFuncao)?.nome || `ID: ${func.idFuncao}`}
                                    </span>
                                </td>

                                <td className="btn-excluir-editar">
                                    <button
                                        onClick={() => onEdit(func)}
                                        className="btn-editar-gestao-funcionario"
                                        title="Editar"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => onDelete(func.id, func.nome)}
                                        className="btn-excluir-gestao-funcionario"
                                        title="Excluir"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}