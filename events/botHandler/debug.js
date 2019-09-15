const { Listener } = require('discord-akairo');

module.exports = class discordDebugistener extends Listener {
	constructor() {
		super('discordebug', {
			emitter: 'client',
			event: 'debug',
			category: 'botHandler'
		});
	}

	exec(debug) {
		let err = debug.toString().toLowerCase();
		if (err.includes("voice")) console.log("[DISCORD VOICE DEBUG]", debug);
	}
}