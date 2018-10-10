const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const buildPath = "build";

module.exports = {
    mode: "production",
    devtool: "source-map",
    entry: './src/main.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ],
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.json']
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, buildPath)
    },
    plugins: [
        new CleanWebpackPlugin([buildPath]),
        new CopyWebpackPlugin([
            {
                from: "src/chrome_manifest.json",
                to: "manifest.json",
                transform: (content) => {
                    return Buffer.from(JSON.stringify({
                        description: process.env.npm_package_description,
                        version: process.env.npm_package_version,
                        ...JSON.parse(content.toString())
                    }))
                }
            },
            {from: "src/assets", to: "assets"},
            {from: "src/styles"}
        ]),
    ]
};