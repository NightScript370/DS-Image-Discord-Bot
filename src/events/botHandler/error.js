import { Listener } from 'discord-akairo';

export default class discordErrorListener extends Listener {
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