/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily:{ 
            display:['Inter','ui-sans-serif','system-ui','sans-serif'] 
        } 
    },
  },
  plugins: [],
}

