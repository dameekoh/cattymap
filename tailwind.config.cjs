/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/routes/**/*.{svelte,js,ts}',
    './src/lib/**/*.{svelte,js,ts}', 
  ],
  theme: {
    extend: {},
  },
  // daisyui: {
  //   themes: ["valentine"],
  // },
  plugins: [require('daisyui')],
}

