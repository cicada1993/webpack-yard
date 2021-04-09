const webpack = require('webpack')
const { merge } = require('webpack-merge')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const NblityPlugin = require('./plugins/nblity')
module.exports = merge(
    process.env.NODE_ENV === 'production' ? require('./production.config') : require('./development.config'),
    {
        entry: "./src/main.js",
        output: {
            clean: true
        },
        module: {
            rules: [
                {
                    test: /\.nblity$/, loader: path.resolve(__dirname, './loaders/nblity.js')
                },
                {
                    test: /\.cside$/, loader: path.resolve(__dirname, './loaders/cside.js')
                },
                {
                    test: /\.svelte$/, loader: 'svelte-loader'
                }
            ]
        },
        plugins: [
            new NblityPlugin(),
            new HtmlWebpackPlugin({ template: './public/index.html' }),
            new webpack.DefinePlugin({
                "process.env": JSON.stringify({
                    NODE_ENV: process.env.NODE_ENV
                })
            })
        ]
    })