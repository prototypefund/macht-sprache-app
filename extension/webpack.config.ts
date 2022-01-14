import dotenv from 'dotenv';
import * as fs from 'fs';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as path from 'path';
import * as webpack from 'webpack';

const getEnvVars = () => {
    const dotenvPath = path.resolve(__dirname, '..', '.env');
    const { NODE_ENV } = process.env;
    const dotenvFiles = [
        dotenvPath,
        `${dotenvPath}.${NODE_ENV}`,
        `${dotenvPath}.local`,
        `${dotenvPath}.${NODE_ENV}.local`,
    ];

    const envVars = {
        ...dotenvFiles.reduce<{ [key: string]: string }>((acc, filePath) => {
            const curVars = fs.existsSync(filePath) ? dotenv.parse(fs.readFileSync(filePath)) : {};
            return { ...acc, ...curVars };
        }, {}),
        ...process.env,
    };

    const reactAppVars = Object.keys(envVars)
        .filter(key => /^REACT_APP_/i.test(key))
        .reduce((acc, key) => ({ ...acc, [key]: JSON.stringify(envVars[key]) }), {});

    return reactAppVars;
};

const config: webpack.Configuration = {
    entry: {
        'content-google-translate': '../src/extension/googleTranslate.tsx',
    },
    output: {
        path: path.resolve(__dirname, 'bundle', 'dist'),
        filename: '[name].js',
        publicPath: '',
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    compilerOptions: {
                        noEmit: false,
                    },
                },
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: 'asset/resource',
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new webpack.DefinePlugin({
            'process.env': { REACT_APP_EMULATOR_HOST: JSON.stringify('localhost'), ...getEnvVars() },
        }),
    ],
};

export default config;
