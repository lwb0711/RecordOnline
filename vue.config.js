module.exports = {
	devServer: {
		host: "localhost",
		port: "8080",
		open: true
	},
	publicPath: process.env.NODE_ENV === 'production' ? './': '/'
}