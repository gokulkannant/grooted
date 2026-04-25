export const spacing = {
  unit: 4,
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
  gutter: 24,
  margin: 32,
} as const;

// Neo-brutalist: sharp corners with optional slight rounding
export const radius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  full: 9999,
} as const;

// Hard offset shadows (neo-brutalist signature)
export const shadows = {
  sm: {
    shadowColor: "#000000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  md: {
    shadowColor: "#000000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000000",
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  pressed: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
} as const;
