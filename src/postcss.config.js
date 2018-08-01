// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "presets": ["es2015", "stage-0", "react"],
  plugins: [
    require('autoprefixer')({
      browsers: 'ios >= 8'
    }),
    "transform-runtime"
  ]
};