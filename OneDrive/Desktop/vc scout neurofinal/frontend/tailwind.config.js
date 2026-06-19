/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-border": "var(--card-border)",
        primary: "var(--primary)",
        "primary-glow": "var(--primary-glow)",
        "accent-red": "var(--accent-red)",
        "accent-green": "var(--accent-green)",
        "accent-yellow": "var(--accent-yellow)",
        "text-muted": "var(--text-muted)",
      },
    },
  },
  plugins: [],
}
