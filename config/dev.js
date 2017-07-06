var config = {
	port: 3001,
	secret: '0d983fd5c168a969e13ddf2a99666455',
	defaults:{
		psize: 3000
	},
	api:{
		key: '6ec1c63b-08a6-444f-ae6e-72a97d47c079',
	 	url: 'http://localhost:8088'
		//local api connection

		//key: '6ec1c63b-08a6-444f-ae6e-72a97d47c079',


		// key: '86625d18-4060-4747-b448-74cacda950ce',
		// url: 'https://api.zinetgo.com'
		//url: 'https://52.66.82.36'
	},
	redis: {
		url:'redis://localhost:6379'
	},
	cdn: {
		//path: 'https://d1fu5dqflqjmhe.cloudfront.net'
		path: '/assets'
	}
};

module.exports = config;
