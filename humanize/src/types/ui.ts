import type { ReactNode } from "react";
import type { IconType } from "react-icons";

import type { FuncionarioTO, FuncaoTO, EquipeTO } from "./api";

/**
 * Tipagem para o Dropdown do Menu
 */
export interface DropdownProps {
    title: string;
    icon: IconType;
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    children: ReactNode;
}

/**
 * Tipagem para a Tabela de Funcionários (Admin)
 */
export interface ListaFuncionariosProps {
    funcionarios: FuncionarioTO[];
    funcoes: FuncaoTO[];
    onEdit: (func: FuncionarioTO) => void;
    onDelete: (id: number, nome: string) => void;
    isLoading: boolean;
    editingId?: number;
}

/**
 * Tipagem para o Modal de Edição (Admin)
 */
export interface ModalEditarProps {
    funcionario: FuncionarioTO | null;
    equipes: EquipeTO[];
    funcoes: FuncaoTO[];
    onCancel: () => void;
    onSave: (data: FuncionarioTO) => void;
}