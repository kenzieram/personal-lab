import type { Config } from "tailwindcss";
const config: Config = { content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"], theme: { extend: { colors: { lab: { bg: "#0c0d10" } } } }, plugins: [] };
export default config;
