/* eslint-disable @typescript-eslint/no-require-imports */

/** @type {import('tailwindcss').Config} */
module.exports = {
 
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],

  plugins: [
    require('daisyui'),
  ],

  daisyui: {
    themes: [
     
      { nord: {} },
      'dim',
    ],
    defaultTheme: 'nord',
    darkTheme: 'dim',
  },

 
  darkMode: 'class',

  theme: {
    extend: {
      
    },
  },


}

