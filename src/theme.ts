import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ffa800",
      light: "#ffcf66",
      dark: "#d08a00",
    },
    secondary: {
      main: "#ffe1a7",
    },
    background: {
      default: "#0f172a",
      paper: "#111827",
    },
    text: {
      primary: "#e5e7eb",
      secondary: "#94a3b8",
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: `"Satoshi-Regular", "Inter", "ui-sans-serif", "system-ui", "sans-serif"`,
    h1: { fontWeight: 700, letterSpacing: -0.5 },
    h2: { fontWeight: 700, letterSpacing: -0.4 },
    h3: { fontWeight: 600, letterSpacing: -0.2 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: "linear-gradient(145deg, rgba(30,41,59,0.8), rgba(17,24,39,0.9))",
          border: "1px solid rgba(255,255,255,0.05)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: "rgba(148,163,184,0.14)",
        },
        head: {
          color: "#e5e7eb",
          fontWeight: 600,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: "linear-gradient(180deg, #0b1220, #0f172a)",
          borderRight: "1px solid rgba(255,255,255,0.04)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "rgba(15,23,42,0.75)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 12,
        },
      },
    },
  },
});
