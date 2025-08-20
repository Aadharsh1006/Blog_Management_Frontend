module.exports = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.[jt]sx?$':'babel-jest',
    },
    transformIgnorePatterns: [
        'node_modules/(?!(axios/lib|follow-redirects/lib)/)'
    ],
    moduleNameMapper: {
        '^axios$':require.resolve('axios/lib/axios.js'),
    },
};