const foundations = {
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },

  fonts: {
    heading: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
  },

  colors: {
    brand: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3B82F6",
      600: "#2563EB",
      700: "#1D4ED8",
      800: "#1E40AF",
      900: "#1E3A8A",
    },

    bg: {
      canvas: "#0F172A",
      surface: "#1E293B",
      elevated: "#334155",
    },

    border: {
      primary: "rgba(255,255,255,0.08)",
    },

    text: {
      primary: "#F8FAFC",
      secondary: "#CBD5E1",
      muted: "#94A3B8",
    },

    success: "#22C55E",
    danger: "#EF4444",
    warning: "#F59E0B",
  },

  radii: {
    md: "12px",
    lg: "18px",
    xl: "24px",
    full: "9999px",
  },

  shadows: {
    card:
      "0px 10px 40px rgba(0,0,0,0.18)",

    glow:
      "0px 0px 40px rgba(59,130,246,.20)",
  },

  styles: {
    global: {
      body: {
        bg: "bg.canvas",
        color: "text.primary",
      },
    },
  },
};

export default foundations;
