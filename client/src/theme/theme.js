import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },

  colors: {
    brand: {
      500: "#2563EB",
      600: "#1D4ED8",
    },

    bg: {
      primary: "#0F172A",
      secondary: "#1E293B",
    },
  },

  fonts: {
    body: "Inter, system-ui, sans-serif",
    heading: "Inter, system-ui, sans-serif",
  },

  styles: {
    global: {
      body: {
        bg: "bg.primary",
        color: "white",
      },
    },
  },
});

export default theme;