const { Listener } = require('discord-akairo');

module.exports = class LoadListener extends Listener {
	constructor() {
		super('load', {
			emitter: 'commandHandler',
			event: 'load',
			category: 'commandHandler'
		});
	}

	exec(cmd, reload) {
		if (reload)
			console.log(`[RELOAD] ${cmd.id} reloaded`);
		else
			console.log(`[LOAD] ${cmd.id} loaded`);
	}
}