/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      screens : {
        'res': {'max': '600px'}
      },
      borderRadius: {
        'custom' : '0px 20px 20px 0',
        'cust': ' 24px 0 0 24px'
        
      }
    },
  },
  plugins: [],
}