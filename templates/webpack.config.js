module.exports = {
    module: {
        loaders: [
            {
                test: /\.js?$/,
                loader: 'babel', // 'babel-loader' is also a legal name to reference
                query: {
                    presets: ['react', 'es2015']
                }
            }
        ]
    }
};