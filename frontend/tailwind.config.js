/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        text: "var(--color-text)",
        background: "var(--color-background)",
        border: "var(--color-border)",
        accent: "var(--color-accent)",
        muted: "var(--color-muted)",
        highlight: "var(--color-highlight)",
        gradient: "var(--color-gradient)",
        profile: "#3E3F42",
        textSecondary: "#006D67",
        status: "#11B6AB",
      },
      fontFamily: {
        sans: ["Inter var", "Inter", "sans-serif"],
        popin: ["Poppins"],
      },
    },
    plugins: [require("tailwind-scrollbar")],
  },
};
