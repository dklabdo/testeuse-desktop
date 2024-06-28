/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        bg : '#F0F0F0',
        main : '#C50808'
      },
      screens: {
        'xs': {'max': '350px'},
        'xs2': {'max': '540px'},
        'xs3': {'min': '540px'},
        
      },
      fontSize: {
        "sm": "clamp(0.8rem, 0.17vw + 0.76rem, 0.89rem)",
        "base": "clamp(1rem, 0.30vw + 0.79rem, 1.10rem)",
        "lg": "clamp(1.25rem, 0.61vw + 1.1rem, 1.58rem)",
        "xl": "clamp(1.56rem, 1vw + 1.31rem, 2.11rem)",
        "2xl": "clamp(1.95rem, 1.56vw + 1.56rem, 2.81rem)",
        "3xl": "clamp(2.44rem, 2.38vw + 1.85rem, 3.75rem)",
        "4xl": "clamp(3.05rem, 3.54vw + 2.17rem, 5rem)",
        "5xl": "clamp(3.81rem, 5.18vw + 2.52rem, 6.66rem)",
        "6xl": "clamp(4.77rem, 7.48vw + 2.9rem, 8.88rem)"
      },
    },
  },
  plugins: [require('daisyui')],
}

