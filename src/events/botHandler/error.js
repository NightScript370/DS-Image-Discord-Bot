import discordAkairo from 'discord-akairo';

export default class discordErrorListener extends discordAkairo.Listener {
	constructor() {
		super('discorderror', {
			emitter: 'client',
			event: 'error',
			category: 'botHandler'
		});
	}

	exec(error) {
		console.error(error);
	}
}