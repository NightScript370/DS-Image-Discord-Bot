const { Listener } = require('discord-akairo');

module.exports = class UnhandledRejectionListener extends Listener {
	constructor() {
		super('unhandledRejection', {
			event: 'unhandledRejection',
			emitter: 'process',
			category: 'botHandler'
		});
	}

	exec(error) {
		console.error("[UNHANDLED REJECTION]", error);
	}
}