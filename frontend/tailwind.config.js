/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // bgData: "#29221d",
        // bgData: "#1e1611",
        bgData: "#2e2e3c",
        bgDataNew: "#fe6c00",
      },
      fontSize: {
        textdata: "14px",
        newtextdata: "13px",
      },
      fontFamily: {
        bai: ["Verdana", "sans-serif"],
      },
    },
  },
  plugins: [],
};
