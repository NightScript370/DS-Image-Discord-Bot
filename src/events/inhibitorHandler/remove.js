import discordAkairo from 'discord-akairo';

export default class InhibitorRemoveListener extends discordAkairo.Listener {
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