const components = {
  Button: {
    baseStyle: {
      borderRadius: "full",
      fontWeight: "600",
    },

    variants: {
      primary: {
        bg: "brand.500",
        color: "white",

        _hover: {
          bg: "brand.600",
        },
      },

      secondary: {
        bg: "bg.surface",
        color: "text.primary",

        border: "1px solid",

        borderColor: "border.primary",
      },
    },
  },

  Card: {
    baseStyle: {
      bg: "bg.surface",

      border: "1px solid",

      borderColor: "border.primary",

      borderRadius: "xl",
    },
  },
};

export default components;