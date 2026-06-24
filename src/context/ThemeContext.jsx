/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeContextProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem("themeMode");
    if (savedMode) return savedMode;
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
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
                main: "#1B3D41",
                light: "#2E5E63",
                dark: "#0E2325",
              },
              secondary: {
                main: "#81B563",
              },
              background: {
                default: "#FFFBF7",
                paper: "#ffffff",
              },
              text: {
                primary: "#1A2526",
                secondary: "#5E6E70",
              },
              divider: "#D8E1E0",
            }
          : {
              primary: {
                main: "#81B563",
                light: "#A5D987",
                dark: "#5C8E42",
              },
              secondary: {
                main: "#2C8F7A",
              },
              background: {
                default: "#0B1112",
                paper: "#152224",
              },
              text: {
                primary: "#E2ECEB",
                secondary: "#94A4A6",
              },
              divider: "rgba(129, 181, 99, 0.15)",
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
