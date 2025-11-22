import { createContext, useState, type ReactNode } from "react";
import type { ThemeContextType } from "../../types/themeContextType";

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [isDark, setIsDark] = useState(false);

    const toggleTheme = () => {
        setIsDark((prevIsDark) => !prevIsDark);
    };

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
