module.exports = {
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
}