import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      borderColor: {
        dark: "#424B53",
        DEFAULT: "#424B53",
      },
      colors: {
        primary: "#1B222B",
        "primary-light": "#242C35",
        "primary-dark": "#13181E",
        secondary: "#00A3CA",
        "secondary-light": "#0298FF",
        "graph-1": "#AA7EDD",
        "graph-2": "#00A3CA",
        "graph-3": "#8E8ECD"
      },
    },
  },
  plugins: [],
};
export default config;
