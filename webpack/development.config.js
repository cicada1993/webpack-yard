const webpack = require('webpack')
const { merge } = require('webpack-merge')
const { getHostIP } = require('./tool')
module.exports = merge(
    require('./common.config'),
    {
        mode: "development",
        devtool: 'inline-source-map',
        devServer: {
            compress: true,
            host: getHostIP(),
            port: 9000,
        },
        plugins: [
            new webpack.DefinePlugin({
                "process.env": JSON.stringify({
                    NODE_ENV: "development"
                })
            }),
        ]
    }
)