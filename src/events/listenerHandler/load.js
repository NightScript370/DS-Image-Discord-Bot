import discordAkairo from 'discord-akairo';

export default class listenerLoadListener extends discordAkairo.Listener {
	constructor() {
		super('listenerHandlerLoad', {
			emitter: 'listenerHandler',
			event: 'load',
			category: 'listenerHandler'
		});
	}

	exec(cmd, reload) {
		if (reload)
			console.log(`[LISTENER][RELOAD] ${cmd.id} reloaded`);
		else
			console.log(`[LISTENER][LOAD] ${cmd.id} loaded`);
	}
}