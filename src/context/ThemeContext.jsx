import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeContextProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem("themeMode");
    if (savedMode) return savedMode;
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return systemPrefersDark ? "dark" : "light";
  });

  useEffect(() => {
    localStorage.setItem("themeMode", mode);

    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode,
        ...(mode === "light"
          ? {
              primary: {
                main: "#4f46e5",
                light: "#6366f1",
                dark: "#4338ca",
              },
              secondary: {
                main: "#10b981",
              },
              background: {
                default: "#f8fafc",
                paper: "#ffffff",
              },
              text: {
                primary: "#0f172a",
                secondary: "#475569",
              },
              divider: "#e2e8f0",
            }
          : {
              primary: {
                main: "#818cf8",
                light: "#a5b4fc",
                dark: "#6366f1",
              },
              secondary: {
                main: "#34d399",
              },
              background: {
                default: "#0b0f19",
                paper: "#1e293b",
              },
              text: {
                primary: "#f8fafc",
                secondary: "#94a3b8",
              },
              divider: "rgba(255, 255, 255, 0.12)",
            }),
      },
      typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      },
      shape: {
        borderRadius: 12,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 8,
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              backgroundImage: "none",
            },
          },
        },
      },
    });
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
