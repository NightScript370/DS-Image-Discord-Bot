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
		if (/(Sending a heartbeat|Latency of)/i.test(debug)) return null;
		if (/voice/i.test(debug)) return null;
		console.log("[DEBUG] " + debug)
	}
}
