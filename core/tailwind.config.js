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
        
      },
      animation: {
        wiggle : 'wiggle 5s ease infinite'
      },
      keyframes: {
        wiggle: { 
          '0%': { backgroundPosition : '0% 50% '},
          '50%': { backgroundPosition : '100% 50%'},
          '100%': { backgroundPosition : '0% 50%'},
        }
      }
    },
  },
  plugins: [
    function ({ addBase, addUtilities, addComponents}){
      // Ajout des styles de base 
      addBase({
        'p, h1': {
          color: 'rgba(17, 216, 123, 0.923)',
        },
      });
      addUtilities({
        '.glow-effect': {
          boxShadow: '0 0 15px rgba(58, 24, 139, 0.8), 0 0 50px rgba(58, 24, 139, 0.5)',
        },
      })
    }
  ],
}