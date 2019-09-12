const path = require('path');

module.exports = {
    entry: { main: './src/index.js' },
    output: {
        path: path.join(__dirname, './public'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [],
    devtool: 'source-map',
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        compress: true
    }
};