const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");
const fs = require('fs');
require("babel-polyfill");

const getFilesInFolder = (base = '.', scanSubDirectories = false, regularExpression = /\.js$/) => {
    const files = [];
    const rootPath = path.resolve(__dirname, base);

    function readDirectory(directory) {
        fs.readdirSync(directory).forEach((file) => {
            const fullPath = path.resolve(directory, file);

            if (fs.statSync(fullPath).isDirectory()) {
                if (scanSubDirectories) readDirectory(fullPath);
                return;
            }

            if (!regularExpression.test(fullPath)) return;

            const fileName = fullPath.replace(rootPath, '').replace(/\\/g, '/').trim().replace(/^[\/]+|[\/]+$/g, '');
            const absPath = '.' + fullPath.replace(path.resolve(__dirname, '.'), '').replace(/\\/g, '/').trim();
            files.push({ fileName, path: absPath });
        });
    }

    readDirectory(rootPath);

    return files;
};

let pugPages = getFilesInFolder('./app/pug/pages', true, /\.(pug)$/);
pugPages = pugPages.map(item => {
    return new HtmlWebpackPlugin({
        filename: item.fileName.replace('.pug', '.html'),
        minify: {
            collapseWhitespace: false
        },
        hash: true,
        template: item.path,
    })
});

module.exports = {
    entry: {
        sedna: './app/sedna.js',
        app: ['babel-polyfill', './app/app.js'],
    },
    output: {
        path: path.resolve(__dirname, "docs"),
        filename: 'assets/script/[name].js'
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'docs'),
        },
        compress: true,
        port: 9000,
        // contentBase: path.join(__dirname, "docs"),
        // compress: true,
        // port: 3001,
        open: true,
        // stats: 'errors-only',
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    // 'style-loader',
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'postcss-loader'
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            implementation: require("sass"),
                        }
                    }
                ],
            },
            {
                test: /\.pug$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            sources: {
                                urlFilter: (attribute, value, resourcePath) => {
                                    if (/^\/assets\//.test(value)) {
                                        return false;
                                    }
                                    return true;
                                },
                            },
                        },
                    },
                    {
                        loader: 'pug-html-loader',
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "assets/css/[name].css",
            // chunkFilename: "[id].css"
        }),
        ...pugPages,
    ]
};
