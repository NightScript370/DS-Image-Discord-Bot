import discordAkairo from 'discord-akairo';

export default class DBLErrorListener extends discordAkairo.Listener {
	constructor() {
		super('DBLerror', {
			emitter: 'dbl',
			event: 'error',
			category: 'dbl'
		});
	}

	exec(error) {
		console.error(`[DiscordBots.org] An error has occured: ${error}`);
	}
}