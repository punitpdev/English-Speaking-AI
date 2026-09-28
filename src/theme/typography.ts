import type { TextStyle } from "react-native";

// Lingua type scale (Poppins). Keep in sync with the text-style utilities in global.css (h1, h2, body-large, ...).
// Line heights are the design multiplier (1.2, 1.3, ...) times the font size, in px.
export const typography = {
  h1: { fontFamily: "Poppins-Bold", fontSize: 32, lineHeight: 38.4 }, // Page / Screen Title
  h2: { fontFamily: "Poppins-SemiBold", fontSize: 24, lineHeight: 31.2 }, // Section Title
  h3: { fontFamily: "Poppins-SemiBold", fontSize: 20, lineHeight: 26 }, // Card / Module Title
  h4: { fontFamily: "Poppins-Medium", fontSize: 16, lineHeight: 22.4 }, // Subheading
  bodyLarge: { fontFamily: "Poppins-Regular", fontSize: 16, lineHeight: 25.6 }, // Important content
  bodyMedium: { fontFamily: "Poppins-Regular", fontSize: 14, lineHeight: 22.4 }, // Body text
  bodySmall: { fontFamily: "Poppins-Regular", fontSize: 13, lineHeight: 20.8 }, // Supporting text
  caption: { fontFamily: "Poppins-Regular", fontSize: 11, lineHeight: 15.4 }, // Labels, meta text
} as const satisfies Record<string, TextStyle>;
