var path = require('path');
var webpack = require('webpack');

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: [
        'webpack-hot-middleware/client?reload=true',
        './public/js/main.js'
    ],
    output: {
        path: path.join(__dirname, 'public/build/js/'),
        filename: 'main.js',
        publicPath: '/build/js/'
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    module: {
        loaders: [{
            test: /\.js$/,
            loaders: ['babel?optional=runtime'],
            exclude: /node_modules/,
            include: __dirname
        }]
    }
};


/**
 * entry: {
 *    name1: '',
 *    name2: ''
 * }
 * output {
 *    filename: '[name].js'
 * }
 * 'webpack-hot-middleware/client?reload=true',
 * './public/js/main.js'
 * ],
 * */