export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dota: {
          dark: "#090b10",
          card: "rgba(15, 21, 33, 0.75)",
          border: "rgba(255, 255, 255, 0.08)",
          accent: "#06b6d4",
          gold: "#f59e0b",
          radiant: "#34d399",
          dire: "#f87171",
          mana: "#38bdf8",
          hp: "#22c55e",
          lotus: "#ec4899",
          wisdom: "#a855f7",
          neutral: "#10b981",
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -5px rgba(6, 182, 212, 0.4)',
        'glow-gold': '0 0 20px -5px rgba(245, 158, 11, 0.4)',
        'glow-red': '0 0 20px -5px rgba(239, 68, 68, 0.4)',
        'glow-purple': '0 0 20px -5px rgba(168, 85, 247, 0.4)',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
}
