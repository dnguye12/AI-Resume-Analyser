import { useEffect } from "react";
import { useState } from "react";

type Theme = "light" | "dark";

const useTheme = () => {
    const [theme, setTheme] = useState<Theme>("dark")

    useEffect(() => {
        if (typeof window === "undefined") {
            return
        }

        const stored = window.localStorage.getItem("theme");
        if (stored === "dark" || stored === "light") {
            setTheme(stored);
        }
    }, [])

    useEffect(() => {
        if (typeof window === "undefined") {
            return
        }
        document.documentElement.classList.toggle("dark", theme === "dark");
        window.localStorage.setItem("theme", theme);
    }, [theme])

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"))
    }

    return { theme, setTheme, toggleTheme };
}

export default useTheme;