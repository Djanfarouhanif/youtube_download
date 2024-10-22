/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      screens : {
        'res': ['max', '600px']
      }
    },
  },
  plugins: [],
}