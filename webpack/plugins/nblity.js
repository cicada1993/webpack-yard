class NblityPlugin {
    constructor(options = {}) {
        console.log('nblity plugin options', options)
    }
    apply(compiler) {
        compiler.hooks.emit.tapAsync(
            'NblityPlugin',
            (compilation, callback) => {
                console.log('This is an nblity plugin!');
                callback();
            }
        );
        compiler.hooks.compilation.tap('NblityPlugin', (compilation) => {
            // Now we can tap into various hooks available through compilation
            compilation.hooks.optimize.tap('NblityPlugin', () => {
                console.log('Assets are being optimized.');
            });
        });
    }
}

module.exports = NblityPlugin