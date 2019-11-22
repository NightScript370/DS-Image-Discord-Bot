import { Listener } from 'discord-akairo';

export default class InhibitorRemoveListener extends Listener {
	constructor() {
		super('inhibitorHandlerRemove', {
			emitter: 'inhibitorHandler',
			event: 'remove',
			category: 'inhibitorHandler'
		});
	}

	exec(cmd) {
		console.log(`[INHIBITOR][REMOVAL] ${cmd.id} removed`);
	}
}