export const typography = {
  fonts: {
    primary: "PlusJakartaSans",
    secondary: "SpaceGrotesk",
  },
  sizes: {
    xs: 12,   // pixel-code
    sm: 14,   // label-bold
    md: 16,   // body-md
    lg: 18,   // body-lg
    xl: 24,   // headline-md
    xxl: 32,  // headline-lg
    xxxl: 48, // headline-xl
  },
  weights: {
    regular: "400" as const,
    medium: "500" as const,
    bold: "700" as const,
    extrabold: "800" as const,
    black: "900" as const,
  },
} as const;
