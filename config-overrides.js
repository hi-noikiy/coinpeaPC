/* config-overrides.js */
const tsImportPluginFactory = require('ts-import-plugin')

const rewireSass = require('react-app-rewire-scss');
const rewireImport = require('react-app-rewire-import');
const { getLoader } = require('react-app-rewired'); 
const rewireWebpackBundleAnalyzer = require('react-app-rewire-webpack-bundle-analyzer');

module.exports = function override(config, env) {

  // config = injectBabelPlugin('emotion/babel',config);

  config = rewireImport(config, env, {
      libraryName: 'antd',
      libraryDirectory:"es",
      style: 'css',
  })

  if(env !== 'development') {
    // config.output.publicPath = './';
     config.devtool = false;
      
     config = rewireWebpackBundleAnalyzer(config, env, {
      analyzerMode: 'static',
      reportFilename: 'report.html'
    });
    
  }
  
  
 
  const tsLoader = getLoader(
    config.module.rules,
    rule =>
      rule.loader &&
      typeof rule.loader === 'string' &&
      rule.loader.includes('ts-loader')
  );
  
  tsLoader.options = {
    getCustomTransformers: () => ({
        before: [ tsImportPluginFactory({
        libraryDirectory: 'es',
        libraryName: 'antd',
        style: 'css',
      }) ]
    })
  };

  config = rewireSass(config, env);
  return config;
}