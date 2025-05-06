module.exports = {
    root: true,
    parser: '@babel/eslint-parser',
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-native/all',
        'prettier'
    ],
    plugins: ['react', 'react-native', 'prettier'],
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        requireConfigFile: false
    },
    env: {
        'react-native/react-native': true,
    },
    rules: {
        'prettier/prettier': 'error',
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
        'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        'react-native/no-inline-styles': 'warn'
    },
    settings: {
        react: {
            version: 'detect'
        }
    }
};