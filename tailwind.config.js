/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xs: "575px",
      sm: "640px",
      md: "768px",
      lg: "960px",
      xl: "1024px",
      "2xl": "1200px",
      "3xl": "1440px",
    },
    extend: {
      colors: {
        "soft-purple": "hsla(252, 70%, 62%, 1)",
        "light-purple": "hsla(250, 100%, 95%, 1)",
        "medium-purple": "hsla(250, 100%, 94%, 1)",
        "pale-purple": "hsla(250, 100%, 98%, 1)",
        "deep-grey": "hsla(240, 17%, 35%, 1)",
        "off-white": "hsla(220, 27%, 98%, 1)",
        "light-grey": "hsla(240, 10%, 59%, 1)",
        "medium-grey": "hsla(252, 19%, 46%, 1)",
      },
    },
  },
  plugins: [],
};
