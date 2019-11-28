import discordAkairo from 'discord-akairo';

export default class CommandRemoveListener extends discordAkairo.Listener {
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