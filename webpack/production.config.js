const webpack = require('webpack')
const { merge } = require('webpack-merge')
module.exports = merge(
    require('./common.config'),
    {
        mode: "production",
        optimization: {
            splitChunks: {
                cacheGroups: {
                    common: {
                        name: "commons",
                        chunks: "all",
                        minChunks: 1,
                        minSize: 20000
                    }
                }
            }
        },
        plugins: [
            new webpack.DefinePlugin({
                "process.env": JSON.stringify({
                    NODE_ENV: "production"
                })
            }),
        ]
    }
)