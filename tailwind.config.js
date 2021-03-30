module.exports = {
  theme: {
    fontFamily: {
      sans: ['Cabin', 'sans-serif'],
      serif: ['Georgia', 'Cabin', 'sans-serif']
    },
    extend: {
      fontSize: {
        base: '18px'
      },
      colors: {
        overall: '#6dffd4',
        blue: '#112233',
        darkblue: '#232b3d',
        lightblue: '#337ab7',
        dark: '#111',
        light: '#fdfdfd',
        brand: '#2a7ae2'
      }
    }
  },
  plugins: [require('windicss/plugin/typography')]
};
