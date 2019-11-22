import { Listener } from 'discord-akairo';

export default class CommandRemoveListener extends Listener {
	constructor() {
		super('commandHandlerRemove', {
			emitter: 'commandHandler',
			event: 'remove',
			category: 'commandHandler'
		});
	}

	exec(cmd) {
		console.log(`[COMMAND][REMOVAL] ${cmd.id} removed`);
	}
}