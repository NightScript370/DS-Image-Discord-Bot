const { Listener } = require('discord-akairo');

module.exports = class httpErrorListener extends Listener {
	constructor() {
		super('httpError', {
			emitter: 'httpServer',
			event: 'error',
			category: 'httpServer'
		});
	}

	exec(error) {
		if (error.syscall !== "listen")
			console.error(`Could not start http server: ${err}`);

		switch(error.code) {
			case "EACCES":
				console.error(`Port ${this.client.website.express.get('port')} requires elevated privileges`);
				break;
			case "EADDRINUSE":
				console.error(`Port ${this.client.website.express.get('port')} is already in use`);
				break;
			default:
				console.error(`Could not start http server: ${err}`);
		}
	}
}