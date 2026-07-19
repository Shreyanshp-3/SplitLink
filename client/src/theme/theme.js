import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  globalCss: {
    "html, body": {
      minHeight: "100%",
      bg: "gray.50",
      color: "gray.800",
      fontFamily: "body",
    },
    "*": {
      boxSizing: "border-box",
    },
  },
  theme: {
    tokens: {
      colors: {
        primary: { value: "#2563EB" },
        secondary: { value: "#7C3AED" },
        success: { value: "#16A34A" },
        warning: { value: "#D97706" },
        danger: { value: "#DC2626" },
        gray: { value: "#64748B" },
      },
      fonts: {
        body: { value: "Inter, system-ui, sans-serif" },
        heading: { value: "Inter, system-ui, sans-serif" },
      },
      radii: {
        sm: { value: "0.375rem" },
        md: { value: "0.625rem" },
        lg: { value: "0.875rem" },
      },
      fontWeights: {
        normal: { value: "400" },
        medium: { value: "500" },
        semibold: { value: "600" },
        bold: { value: "700" },
      },
      shadows: {
        sm: { value: "0 1px 2px rgba(15, 23, 42, 0.08)" },
        md: { value: "0 4px 12px rgba(15, 23, 42, 0.1)" },
        lg: { value: "0 12px 28px rgba(15, 23, 42, 0.14)" },
      },
    },
  },
});

const theme = createSystem(defaultConfig, config);

export default theme;
