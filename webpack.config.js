module.exports = {
	mode: 'development',
	entry: [
		"./client/index.js",
		"./server/public/style.scss",
	],
	output: {
		path: __dirname,
		filename: "./server/public/bundle.js",
	},
	resolve: {
		extensions: [".js", ".jsx"],
	},
	devtool: "source-map",
	watchOptions: {
		ignored: /node_modules/,
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: "babel-loader",
				options: {
					presets: ["@babel/preset-react"],
				},
			}, {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'file-loader',
                        options: { outputPath: './server/public', name: '[name].min.css'}
                    },
                    'sass-loader'
                ]
            }
		],
	},
}
