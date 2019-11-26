const Listener = require('discord-akairo')

module.exports = class InhibitorRemoveListener extends Listener {
	constructor() {
		super('inhibitorHandlerRemove', {
			emitter: 'inhibitorHandler',
			event: 'remove',
			category: 'inhibitorHandler'
		});
	}

	exec(cmd) {
		console.log(`[INHIBITOR][REMOVAL] ${cmd.id} removed`);
	}
}