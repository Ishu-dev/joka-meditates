/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        accent: "var(--accent)",
        "accent-soft": "var(--accent-soft)",
        deep: "var(--deep)",
        "deep-soft": "var(--deep-soft)",
        rule: "var(--rule)",
        link: "var(--link)",
      },
      borderRadius: {
        card: "var(--radius)",
      },
      fontFamily: {
        display: "var(--font-display)",
        body: "var(--font-body)",
      },
    },
  },
  plugins: [],
};
