module.exports = {
    root: true,
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
        node: true,
    },
    ignorePatterns: ['/node_modules', '/dist', '.eslintrc.js'], // directories to ignore
    plugins: ['prettier'],
    extends: ['plugin:prettier/recommended', 'plugin:node/recommended'],
    rules: {
        'node/no-missing-import': [
            'error',
            {
                tryExtensions: ['.ts', '.js'],
            },
        ],
        'prettier/prettier': 'error',
    },
};
