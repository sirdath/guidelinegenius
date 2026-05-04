import type { Config } from "tailwindcss";

// Design tokens lifted directly from the live site's uicore-global.css so
// pages render in the same palette as guidelinegenius.com.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-open-sans)", "Open Sans", "system-ui", "sans-serif"],
      },
      colors: {
        // Live-site brand palette
        primary: {
          DEFAULT: "#003366", // --uicore-primary-color (navy headlines / brand)
          50: "#e6edf3",
          100: "#c0d2e0",
          200: "#94b2c8",
          300: "#6790ad",
          400: "#3F6F92",
          500: "#1f5078",
          600: "#003366",
          700: "#002a55",
          800: "#001f3f",
          900: "#00152b",
        },
        secondary: {
          DEFAULT: "#3BADFF", // --uicore-secondary-color (link / accent)
          50: "#e9f6ff",
          100: "#cdebff",
          200: "#a3dcff",
          300: "#79cdff",
          400: "#3BADFF",
          500: "#1495ee",
          600: "#0d77c2",
          700: "#0a5e99",
          800: "#084670",
          900: "#062f4a",
        },
        // Light blue background tint for callouts
        accent: {
          light: "#E3F2FD", // --uicore-light-color
        },
        // Purple — primary CTA button colour on the live site (Elementor button)
        cta: {
          DEFAULT: "#5E35B1",
          50: "#f1ebfb",
          100: "#dccff5",
          200: "#bea0ec",
          300: "#9f70e3",
          400: "#7c4cd1",
          500: "#5E35B1",
          600: "#4d2c92",
          700: "#3d2274",
          800: "#2c1854",
        },
        ink: {
          headline: "#101010", // --uicore-headline-color
          body: "#333333", // --uicore-body-color
          muted: "#6B6A6A", // --uicore-accent-color
          dark: "#192939", // --uicore-dark-color
        },
        line: "#ebebeb", // --ui-border-color
      },
      maxWidth: {
        container: "1320px", // --ui-container-size
      },
      borderRadius: {
        ui: "25px",
        "ui-sm": "12.5px",
      },
    },
  },
  plugins: [],
};

export default config;
