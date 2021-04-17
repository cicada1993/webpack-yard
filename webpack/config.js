const webpack = require('webpack')
const { merge } = require('webpack-merge')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const NblityPlugin = require('./plugins/nblity')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
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
                    test: /\.cside$/,
                    use: {
                        loader: path.resolve(__dirname, './loaders/cside.js'),
                        options: {
                            emsdk: {
                                win32: "D:\\emsdk",
                                linux: ""
                            }
                        }
                    }
                },
                {
                    test: /\.svelte$/, use: {
                        loader: 'svelte-loader',
                        options: {
                            emitCss: true,
                        },
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        { loader: MiniCssExtractPlugin.loader },
                        {
                            loader: "css-loader"
                        }
                    ]
                },
                {
                    test: /\.(png|jpg|gif|svg)$/i,
                    type: 'asset/resource'
                },
            ]
        },
        plugins: [
            new NblityPlugin(),
            new MiniCssExtractPlugin(),
            new HtmlWebpackPlugin({ template: './public/index.html' }),
            new webpack.DefinePlugin({
                "process.env": JSON.stringify({
                    NODE_ENV: process.env.NODE_ENV
                })
            }),
            new webpack.ProgressPlugin((percentage, message, ...args) => {
                // e.g. Output each progress message directly to the console:
                //console.info(percentage, message, ...args);
            })
        ],
        optimization: {
            minimize: true,
            minimizer: [
                new CssMinimizerPlugin(),
            ],
        },
    })