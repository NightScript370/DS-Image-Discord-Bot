import discordAkairo from 'discord-akairo';

export default class UnhandledRejectionListener extends discordAkairo.Listener {
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