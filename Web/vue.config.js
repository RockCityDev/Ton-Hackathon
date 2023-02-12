'use strict'
const path = require( 'path' )
const env = process.env
const publicPath = './'
const defaultSettings = require( './src/settings.js' )
const SpeedMeasurePlugin = require( 'speed-measure-webpack-plugin' )
const HardSourceWebpackPlugin = require( 'hard-source-webpack-plugin' )
const CompressionWebpackPlugin = require( 'compression-webpack-plugin' )
// const productionGzipExtensions = ['js', 'css']

function resolve( dir ) {
  return path.join( __dirname, dir )
}

const name = defaultSettings.title || 'ton-pc'
const port = env.port || env.npm_config_port || 9527
module.exports = {
  publicPath : publicPath,
  outputDir : 'dist',
  assetsDir : 'static',
  indexPath : 'index.html',
  filenameHashing : true,
  lintOnSave : false,
  runtimeCompiler : false,
  productionSourceMap : false,
  configureWebpack : {
    name : name,
    resolve : {
      alias : {
        '@' : resolve( 'src' ),
        '@c' : resolve( 'src/components' ),
        '@u' : resolve( 'src/utils' ),
        '@a' : resolve( 'src/api' ),
        '@sty' : resolve( 'src/styles' )
      }
    },
    devtool : process.env.NODE_ENV === 'dev' ? 'source-map' : undefined,
    plugins : [
      new CompressionWebpackPlugin( {
        filename : '[path].gz[query]',
        algorithm : 'gzip',
        // test : new RegExp( '\\.(' + productionGzipExtensions.join( '|' ) + ')$' ),
        test : /\.(js|css|html|svg)$/,
        threshold : 10240,
        minRatio : 0.8
      } ),
      new HardSourceWebpackPlugin( {
        // cacheDirectory : 'node_modules/.cache/hard-source/[confighash]',
        environmentHash : {
          root : process.cwd(),
          directories : [],
          files : ['package-lock.json', 'yarn.lock', 'package.json', 'vue.config.js']
        }
      } )
    ]
  },
  chainWebpack( config ) {
    config.plugins.delete( 'preload' ) // TODO: need test
    config.plugins.delete( 'prefetch' ) // TODO: need test
    // config.plugin( 'xcCache' ).use( HardSourceWebpackPlugin )
    config.plugin( 'speedTime' ).use( SpeedMeasurePlugin )
    config.module
      .rule( 'fonts' )
      .use( 'url-loader' )
      .loader( 'url-loader' )
      .tap( options => Object.assign( options, { limit : 1024 } ) )
    config.module
      .rule( 'images' )
      .use( 'url-loader' )
      .loader( 'url-loader' )
      .tap( options => Object.assign( options, { limit : 10240 } ) )
    config.module
      .rule( 'svg' )
      .exclude.add( resolve( 'src/icons' ) )
      .end()
    config.module
      .rule( 'icons' )
      .test( /\.svg$/ )
      .include.add( resolve( 'src/icons' ) )
      .end()
      .use( 'svg-sprite-loader' )
      .loader( 'svg-sprite-loader' )
      .options( {
        symbolId : 'icon-[name]'
      } )
      .end()
    config.module
      .rule( 'vue' )
      .use( 'vue-loader' )
      .loader( 'vue-loader' )
      .tap( options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      } )
      .end()
    config
      .when( process.env.NODE_ENV === 'development',
        config => config.devtool( 'cheap-source-map' )
      )

    config
      .when( process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin( 'ScriptExtHtmlWebpackPlugin' )
            .after( 'html' )
            .use( 'script-ext-html-webpack-plugin', [{
              inline : /runtime\..*\.js$/
            }] )
            .end()
          config
            .optimization.splitChunks( {
              chunks : 'all',
              cacheGroups : {
                libs : {
                  name : 'chunk-libs',
                  test : /[\\/]node_modules[\\/]/,
                  priority : 10,
                  chunks : 'initial'
                },
                elementUI : {
                  name : 'chunk-elementUI',
                  priority : 20,
                  test : /[\\/]node_modules[\\/]_?element-ui(.*)/
                },
                commons : {
                  name : 'chunk-commons',
                  test : resolve( 'src/components' ),
                  minChunks : 3,
                  priority : 5,
                  reuseExistingChunk : true
                }
              }
            } )
          config.optimization.runtimeChunk( 'single' )
        }
      )
  },
  transpileDependencies : [
    // /[/\\]node_modules[/\\]mavon-editor[/\\]/
    // /[\\/]node_modules[\\/]_?mavon-editor(.*)/
  ],
  devServer : {
    port,
    open : false,
    https : true,
    hotOnly : true,
    compress : true,
    overlay : {
      warnings : false,
      errors : false
    },
    proxy : {
      '/api' : {
        target : env.VUE_APP_PREFIX,
        ws : false,
        changeOrigin : true,
        pathRewrite : {
          '^/api' : ''
        }
      }
    }
  }
}
