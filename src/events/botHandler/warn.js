import discordAkairo from 'discord-akairo';

export default class warnListener extends discordAkairo.Listener {
	constructor() {
		super('warn', {
			emitter: 'client',
			event: 'warn',
			category: 'botHandler'
		});
	}

	exec(warning) {
		console.log("[CLIENT][WARN]", warning);
	}
};