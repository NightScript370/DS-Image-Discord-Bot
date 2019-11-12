import Listener from 'discord-akairo';

export default class listenerRemoveListener extends Listener {
	constructor() {
		super('listenerHandlerRemove', {
			emitter: 'listenerHandler',
			event: 'remove',
			category: 'listenerHandler'
		});
	}

	exec(cmd) {
		console.log(`[listener][REMOVAL] ${cmd.id} removed`);
	}
}