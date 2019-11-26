const Listener = require('discord-akairo')

module.exports = class listenerLoadListener extends Listener {
	constructor() {
		super('listenerHandlerLoad', {
			emitter: 'listenerHandler',
			event: 'load',
			category: 'listenerHandler'
		});
	}

	exec(cmd, reload) {
		if (reload)
			console.log(`[LISTENER][RELOAD] ${cmd.id} reloaded`);
		else
			console.log(`[LISTENER][LOAD] ${cmd.id} loaded`);
	}
}