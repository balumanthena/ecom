import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        royal: {
          50:'#faf8f3',100:'#f3eddc',200:'#e5d8b8',300:'#d5bf8a',
          400:'#c4a55b',500:'#b9913f',600:'#9a7934',700:'#7a5f2a',
          800:'#5a4620',900:'#3a2d16'
        }
      }
    }
  },
  plugins: [],
};

export default config;
