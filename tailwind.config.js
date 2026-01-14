import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
   daisyui: {
    themes: [ "night", "nord"
      ,{
       mytheme: {
          
"primary": "#F7F3E3",
          
"secondary": "#AF9164",
          
"accent": "#4D1E10",
          
"neutral": "#2B2118",
          
"base-100": "#d5d5cd",
          
"info": "#a28f8b",
          
"success": "#c4c6c2",
          
"warning": "#6F1A07",
          
"error": "#EC4444",
    }
  }
  ],
  }
}



