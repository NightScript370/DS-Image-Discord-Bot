import { Listener } from 'discord-akairo';

export default class UnhandledRejectionListener extends Listener {
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