'use strict';

module.exports = (app) => {
	let userHanders = require('../controllers/userController.js');

	app.post('/auth/register', userHanders.register)

	app.post('/auth/signin', userHanders.signin)

}