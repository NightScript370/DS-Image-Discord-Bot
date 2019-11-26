const Listener = require('discord-akairo')

module.exports = class CommandRemoveListener extends Listener {
	constructor() {
		super('commandHandlerRemove', {
			emitter: 'commandHandler',
			event: 'remove',
			category: 'commandHandler'
		});
	}

	exec(cmd) {
		console.log(`[COMMAND][REMOVAL] ${cmd.id} removed`);
	}
}