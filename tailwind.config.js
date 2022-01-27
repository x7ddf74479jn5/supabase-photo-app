const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        md: '560px',
        lg: '960px',
      },
      colors: {
        main: '#297a89',
        main_hover: '#4eb7ca',
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      const newUtilities = {
        '.skew-5deg': {
          transform: 'skewY(-5deg)',
        },
      };
      addUtilities(newUtilities);
    }),
  ],
};
